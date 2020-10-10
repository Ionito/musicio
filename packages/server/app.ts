import * as io from "socket.io";

import {Song} from "./types";
import musicApi from "./api/music";
import roomApi from "./api/room";

const PORT = process.env.PORT || 3000;

const server = io.listen(PORT);
const MAX_POINTS = 5;
const TIME_TO_ASSERT = 2 * 60000; //dos minutos

const timeout = (room: string) => {
  console.log("Game Finish - Reach time", room);
  finishGameAndRestart(room);
};

const finishGameAndRestart = (room: string) => {
  server.in(room).emit("timeout");

  roomApi.update(room, {
    status: "finished",
  });

  const roomToreset = roomApi.get(room);
  if (roomToreset.timerId) {
    clearTimeout(roomToreset.timerId);
  }

  server.in(room).emit("game", roomApi.game(room));

  //pregunto si es el final de la partida
  //pregunto si sigue habiendo gente antes de tirar la proxima cancion
  if (roomToreset.players.length !== 0) {
    if (roomToreset.rounds > 1) {
      setTimeout(async () => {
        await roomApi.reset(room);

        const timeoutId: NodeJS.Timeout = setTimeout(() => timeout(room), TIME_TO_ASSERT);
        roomApi.update(room, {
          timerId: timeoutId,
        });
        server.in(room).emit("startTimer");
        server.in(room).emit("game", roomApi.game(room));
      }, 2500);
    } else {
      roomApi.update(room, {
        status: "finishAll",
      });
      server.in(room).emit("game", roomApi.game(room));

      //el juego vuelve a empezar solo en 30 seg
      setTimeout(async () => {
        await roomApi.resetAll(room);

        const timeoutId: NodeJS.Timeout = setTimeout(() => timeout(room), TIME_TO_ASSERT);
        roomApi.update(room, {
          timerId: timeoutId,
        });
        server.in(room).emit("startTimer");
        server.in(room).emit("game", roomApi.game(room));
      }, 30000);
    }
  }
};

server.on("connection", async (socket) => {
  const {room, name} = socket.handshake.query;

  if (!roomApi.get(room)) {
    await roomApi.setup(room);
    const timeoutId: NodeJS.Timeout = setTimeout(() => timeout(room), TIME_TO_ASSERT);
    console.log("SET TIME OUT SETUP");

    roomApi.update(room, {
      timerId: timeoutId,
    });
  }

  socket.join(room, () => {
    roomApi.connect(room, socket.id, name);
    server.in(room).emit("startTimer");
    server.in(room).emit("game", roomApi.game(room));
  });

  socket.on("guess", async (guess: Song) => {
    const state = roomApi.get(room);

    if (!state || state.status !== "playing") {
      return;
    }

    const matchTitle = musicApi.matches(guess.title, state.song.title);
    const matchAuthor = musicApi.matches(guess.author, state.song.author);

    let currentGuessedAuthors = state.guessedAuthors;
    let currentGuessedTitles = state.guessedTitles;
    let currentWinners = state.winner;
    let currentPlayers = state.players;

    if (matchAuthor && !currentGuessedAuthors.includes(socket.id)) {
      const pointToAssign = MAX_POINTS - currentGuessedAuthors.length;
      currentPlayers[currentPlayers.findIndex((user) => user.id === socket.id)].points +=
        pointToAssign > 0 ? pointToAssign : 0;
      currentGuessedAuthors.push(socket.id);
    }

    if (matchTitle && !currentGuessedTitles.includes(socket.id)) {
      const pointToAssign = MAX_POINTS - currentGuessedTitles.length;
      currentPlayers[currentPlayers.findIndex((user) => user.id === socket.id)].points +=
        pointToAssign > 0 ? pointToAssign : 0;
      currentGuessedTitles.push(socket.id);
    }

    if (matchAuthor && matchTitle) {
      const pointToAssign = MAX_POINTS - currentWinners.length;
      currentPlayers[currentPlayers.findIndex((user) => user.id === socket.id)].points +=
        pointToAssign > 0 ? pointToAssign : 0;
      currentWinners.push(socket.id);
    }

    roomApi.update(room, {
      guessedAuthors: [...currentGuessedAuthors],
      guessedTitles: [...currentGuessedTitles],
      winner: [...currentWinners],
    });

    console.log(currentGuessedAuthors);

    server.in(room).emit("game", roomApi.game(room));

    //pregunto si todos los usuarios adivinaron y termino la partida
    if (currentWinners.length === state.players.length) {
      console.log("Game Finish - all guess");
      finishGameAndRestart(room);
    }
  });

  socket.on("disconnect", () => {
    roomApi.disconnect(room, socket.id);

    server.in(room).emit("game", roomApi.game(room));
  });
});

export default server;
