import * as io from "socket.io";

import {Song} from "./types";
import musicApi from "./api/music";
import roomApi from "./api/room";

const PORT = process.env.PORT || 3000;

const server = io.listen(PORT);
const MAX_POINTS = 21;

const timeout = (room: string) => {
  console.log("timeout ROOM", room);
  server.in(room).emit("timeout");
};

const finishGameAndRestart = (room: string) => {
  roomApi.update(room, {
    status: "finished",
  });

  server.in(room).emit("game", roomApi.game(room));

  setTimeout(async () => {
    await roomApi.reset(room);
    server.in(room).emit("game", roomApi.game(room));
  }, 5000);
};

server.on("connection", async (socket) => {
  const {room, name} = socket.handshake.query;

  if (!roomApi.get(room)) {
    await roomApi.setup(room);
    setTimeout(() => timeout(room), 60000 * 2);
  }

  socket.join(room, () => {
    roomApi.connect(room, socket.id, name);

    server.in(room).emit("game", roomApi.game(room));
  });

  socket.on("guess", async (guess: Song) => {
    const state = roomApi.get(room);
    console.log("on guess - server", guess);
    console.log("on state - server", state);

    if (!state || state.status !== "playing") {
      return;
    }

    const matchTitle = musicApi.matches(guess.title, state.song.title);
    const matchAuthor = musicApi.matches(guess.author, state.song.author);

    let currentGuessedAuthors = state.guessedAuthors;
    let currentGuessedTitles = state.guessedTitles;
    let currentWinners = state.winner;
    let currentPlayers = state.players;

    if (matchAuthor && !currentGuessedAuthors.includes(name)) {
      currentGuessedAuthors.push(name);
      const pointToAssign = MAX_POINTS - currentGuessedAuthors.length;
      currentPlayers[currentPlayers.findIndex((user) => user.name === name)].points +=
        pointToAssign > 0 ? pointToAssign : 0;
    }

    if (matchTitle && !currentGuessedTitles.includes(name)) {
      currentGuessedTitles.push(name);
      const pointToAssign = MAX_POINTS - currentGuessedTitles.length;
      currentPlayers[currentPlayers.findIndex((user) => user.name === name)].points +=
        pointToAssign > 0 ? pointToAssign : 0;
    }

    if (matchAuthor && matchTitle) {
      currentWinners.push(name);
      const pointToAssign = MAX_POINTS - currentWinners.length;
      currentPlayers[currentPlayers.findIndex((user) => user.name === name)].points +=
        pointToAssign > 0 ? pointToAssign : 0;
    }

    roomApi.update(room, {
      guessedAuthors: [...currentGuessedAuthors],
      guessedTitles: [...currentGuessedTitles],
      winner: [...currentWinners],
    });

    server.in(room).emit("game", roomApi.game(room));

    //pregunto si todos los usuarios adivinaron y termino la partida

    if (currentWinners.length === state.players.length) {
      console.log("finish and restart");
      finishGameAndRestart(room);
    }
  });

  socket.on("disconnect", () => {
    roomApi.disconnect(room, socket.id);

    server.in(room).emit("game", roomApi.game(room));
  });
});

export default server;
