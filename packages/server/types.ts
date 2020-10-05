export interface Player {
  id: string;
  name: string;
  points: number;
}

export interface Song {
  title: string;
  author: string;
  year: number;
  source: string;
}

export interface Room {
  status: "playing" | "finished";
  winner: string | null;
  players: Player[];
  song: Song;
  songTitle?: string;
}
/* 
export interface Game extends Omit<Room, "pokemon"> {
  pokemon: string;
}
 */
