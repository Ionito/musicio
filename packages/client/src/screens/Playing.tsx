import React from "react";

import {Game} from "../types";

interface Props {
  song: Game["song"];
  onGuess: (guess: string) => void;
}

const PlayingScreen: React.FC<Props> = ({song, onGuess}: Props) => {
  // const [guessAuthor, setGuessAuthor] = React.useState<Song["author"]>("");
  const [guessTitle, setGuessTitle] = React.useState<Game["song"]>("");
  // const [guessYear, setGuessYear] = React.useState<Song["year"]>();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    guessTitle && onGuess(guessTitle);
  }

  return (
    <>
      <h1>Escuchate este tema</h1>

      <audio controls>
        <source src={song} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <form style={{display: "inline-flex"}} onSubmit={handleSubmit}>
        <div className="nes-field">
          <label htmlFor="name_field">Titulo</label>
          <input
            onChange={(event) => setGuessTitle(event.target.value)}
            autoFocus
            className="nes-input"
            id="name_field"
            type="text"
          />
        </div>

        {/*    <div className="nes-field">
          <label htmlFor="author">Autor</label>
          <input className="nes-input" id="author" type="text" />
        </div>

        <div className="nes-field">
          <label htmlFor="year">Año</label>
          <input className="nes-input" id="year" type="text" />
        </div> */}

        {/*   <input
          autoFocus
          className="nes-input"
          data-test-id="input"
          onChange={(event) => setGuess(event.target.value)}
        /> */}
        <button className="nes-btn is-primary" type="submit">
          Adivinar
        </button>
      </form>
    </>
  );
};

export default PlayingScreen;
