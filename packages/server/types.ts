export interface Player {
  id: string;
  name: string;
  points: number;
}

export interface Song {
  id: number;
  title: string;
  author: string;
  year?: number;
  source?: string;
}

export interface Room {
  status: "playing" | "finished" | "finishAll" | "lobby";
  winner: string[];
  guessedTitles: string[];
  guessedAuthors: string[];
  players: Player[];
  song: Song;
  songTitle?: string;
  timerId: NodeJS.Timeout | null;
  rounds: number;
  ownerId: null | string;
  played: number[];
}
/* 
export interface Game extends Omit<Room, "pokemon"> {
  pokemon: string;
}
 */
