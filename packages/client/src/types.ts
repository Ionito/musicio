export type Song = {
  source?: string;
  title: string;
  author: string;
};
export interface Game {
  status:
    | 'init'
    | 'loading'
    | 'playing'
    | 'disconnected'
    | 'finished'
    | 'finish';
  song: Song;
  winner?: string[];
  guessedTitles: string[];
  guessedAuthors: string[];
  round: number;
  players: {
    id: string;
    name: string;
    points: number;
  }[];
}
