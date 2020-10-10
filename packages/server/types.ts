export interface Player {
  id: string;
  name: string;
  points: number;
}

export interface Song {
  title: string;
  author: string;
  year?: number;
  source?: string;
}

export interface Room {
  status: "playing" | "finished" | "finishAll";
  winner: string[];
  guessedTitles: string[];
  guessedAuthors: string[];
  players: Player[];
  song: Song;
  songTitle?: string;
  timerId: NodeJS.Timeout | null;
  rounds: number;
}
/* 
export interface Game extends Omit<Room, "pokemon"> {
  pokemon: string;
}
 */
