export type Song = {
  source?: string;
  title: string;
  author: string;
};
export interface Game {
  status:
    | 'init'
    | 'loading'
    | 'lobby'
    | 'playing'
    | 'disconnected'
    | 'finished'
    | 'finishAll';
  ownerId: null | string;
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
