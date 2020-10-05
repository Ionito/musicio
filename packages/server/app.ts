import * as io from "socket.io";

import musicApi from "./api/music";
import roomApi from "./api/room";

const server = io.listen(3000);

const timeout = (room: string) => {
  console.log("timeout ROOM", room);
  server.in(room).emit("timeout");
};

server.on("connection", async (socket) => {
  const {room, name} = socket.handshake.query;

  if (!roomApi.get(room)) {
    await roomApi.setup(room);
    setTimeout(() => timeout(room), 10000);
  }

  socket.join(room, () => {
    roomApi.connect(room, socket.id, name);

    server.in(room).emit("game", roomApi.game(room));
  });

  socket.on("guess", async (guess) => {
    const state = roomApi.get(room);

    if (!state || state.status !== "playing") {
      return;
    }

    if (musicApi.matches(guess, state.song.title)) {
      // un usuario acierta

      // pregunto si quedan jugadores sin acertar

      // si quedan, agrego al jugador que acerto a la lista de ganadores y no hago nada

      // si no quedan, termino la partida
      roomApi.update(room, {
        status: "finished",
        winner: name,
      });

      server.in(room).emit("game", roomApi.game(room, true));

      setTimeout(async () => {
        await roomApi.reset(room);
        server.in(room).emit("game", roomApi.game(room));
      }, 3000);
    }
  });

  socket.on("disconnect", () => {
    roomApi.disconnect(room, socket.id);

    server.in(room).emit("game", roomApi.game(room));
  });
});

export default server;
