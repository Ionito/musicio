import {Room} from "../types";

import musicApi from "./music";

const rooms = new Map<string, Room>();
const GAME_ROUNDS = 15;

const api = {
  get: (name: string) => {
    return rooms.get(name) as Room;
  },
  update: async (name: string, values: Partial<Room>) => {
    const room = api.get(name);

    rooms.set(name, {
      ...room,
      ...values,
    });
  },
  setup: async (name: string) => {
    await rooms.set(name, {
      status: "lobby",
      song: await musicApi.random(),
      guessedTitles: [],
      guessedAuthors: [],
      winner: [],
      players: [],
      timerId: null,
      rounds: GAME_ROUNDS,
      ownerId: null,
    });
  },
  reset: async (name: string) => {
    const room = api.get(name);

    rooms.set(name, {
      status: "playing",
      song: await musicApi.random(),
      winner: [],
      guessedTitles: [],
      guessedAuthors: [],
      players: room?.players || [],
      timerId: null,
      rounds: room.rounds - 1,
      ownerId: room.ownerId,
    });
  },
  resetAll: async (name: string) => {
    const room = api.get(name);

    const newPlayers = room?.players.map((player) => {
      return {...player, points: 0};
    });

    rooms.set(name, {
      status: "playing",
      song: await musicApi.random(),
      winner: [],
      guessedTitles: [],
      guessedAuthors: [],
      players: newPlayers || [],
      timerId: null,
      rounds: GAME_ROUNDS,
      ownerId: room.ownerId,
    });
  },
  connect: (name: string, id: string, player: string) => {
    const room = api.get(name);

    api.update(name, {
      players: room.players.concat({id, name: player, points: 0}),
      ownerId: room.players.length === 0 && room.ownerId === null ? id : room.ownerId,
    });
  },
  disconnect: (name: string, id: string) => {
    const room = api.get(name);

    api.update(name, {
      players: room.players.filter((player) => player.id !== id),
    });
  },
  game: (name: string) => {
    const room = api.get(name);

    return {
      status: room.status,
      winner: room.winner,
      players: room.players,
      song: room.song,
      guessedTitles: room.guessedTitles,
      guessedAuthors: room.guessedAuthors,
      round: room.rounds,
      ownerId: room.ownerId,
    };
  },
};

export default api;
