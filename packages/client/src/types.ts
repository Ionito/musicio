export interface Game {
  status: "init" | "loading" | "playing" | "disconnected" | "finished" | "finish";
  song: string;
  winner?: string;
  songTitle: string;
  round: number;
  players: {
    id: string;
    name: string;
    points: number;
  }[];
}
