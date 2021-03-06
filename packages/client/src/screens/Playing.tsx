import 'react-h5-audio-player/lib/styles.css';

import React from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

import SplitText from '../components/SplitText';
import { Game, Song } from '../types';

interface Props {
  song: Game['song'];
  onGuess: (guess: Song) => void;
  matchT: boolean;
  matchA: boolean;
}

const changedVolume = (e: any) => {
  if (e.target.volume) {
    console.log(e.target.volume);
    localStorage.setItem('playervolume', e.target.volume);
  }
};

const audioPlayer = (source: string | undefined) => (
  <AudioPlayer
    autoPlay
    src={source}
    showJumpControls={false}
    onVolumeChange={e => changedVolume(e)}
    volume={
      localStorage.getItem('playervolume')
        ? parseFloat(localStorage.getItem('playervolume') || '')
        : 1
    }
    customProgressBarSection={[
      RHAP_UI.CURRENT_TIME,
      <div key="pepe" style={{ flex: 'auto' }}></div>,
      RHAP_UI.DURATION,
    ]}
    customAdditionalControls={[]}
    /*   onPlay={e => console.log("onPlay")} */
  />
);

const PlayingScreen: React.FC<Props> = ({
  song,
  onGuess,
  matchT,
  matchA,
}: Props) => {
  const [guessAuthor, setGuessAuthor] = React.useState('');
  const [guessTitle, setGuessTitle] = React.useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const adivinaSong = { title: guessTitle, author: guessAuthor } as Song;
    (guessTitle || guessAuthor) && onGuess(adivinaSong);
  }

  return (
    <>
      <h1>
        <SplitText copy="Escuchate" role="heading" /> <br />
        <SplitText copy="este tema" role="heading" />
      </h1>
      <div style={{ position: 'relative', width: 384 }}>
        {audioPlayer(song.source)}
      </div>

      <form
        style={{ display: 'inline-flex', flexDirection: 'column' }}
        onSubmit={handleSubmit}
      >
        <div className="nes-field" style={{ marginTop: 20 }}>
          <label className="nes-text is-primary" htmlFor="name_field">
            Titulo
            {matchT && (
              <i
                className="nes-icon coin is-small"
                style={{ marginLeft: 10 }}
              ></i>
            )}
          </label>
          <input
            disabled={matchT}
            onChange={event => setGuessTitle(event.target.value)}
            autoFocus
            className={`nes-input ${matchT ? 'is-success' : ''}`}
            id="name_field"
            type="text"
          />
        </div>
        <div className="nes-field" style={{ marginTop: 15 }}>
          <label className="nes-text is-error" htmlFor="author">
            Autor
            {matchA && (
              <i
                className="nes-icon coin is-small"
                style={{ marginLeft: 10 }}
              ></i>
            )}
          </label>
          <input
            disabled={matchA}
            onChange={event => setGuessAuthor(event.target.value)}
            className={`nes-input ${matchA ? 'is-success' : ''}`}
            id="author"
            type="text"
          />
        </div>
        <button
          disabled={matchA && matchT}
          className={`nes-btn is-primary ${
            matchA && matchT ? 'is-disabled' : ''
          }`} //is-disabled
          type="submit"
          style={{ marginTop: 15 }}
        >
          Adivinar
        </button>
      </form>
    </>
  );
};

export default PlayingScreen;
