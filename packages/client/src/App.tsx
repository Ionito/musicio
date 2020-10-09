import './styles/styles.css';

import React from 'react';
import io from 'socket.io-client';

import ConnectScreen from './screens/Connect';
import DisconnectedScreen from './screens/Disconnected';
import FinishedScreen from './screens/Finished';
import LoadingScreen from './screens/Loading';
import PlayingScreen from './screens/Playing';
import { Game, Song } from './types';

const socket = io(process.env.REACT_APP_SERVER_URL || '/', {
  autoConnect: false,
});

function App() {
  const [game, setGame] = React.useState<null | Game>(null);
  const [status, setStatus] = React.useState<Game['status']>('init');
  const [user, setUser] = React.useState('');

  function handleConnect(name: string, room: string) {
    setUser(name);
    socket.io.opts.query = {
      name,
      room,
    };

    socket.open();
  }

  function onGame(game: any) {
    setGame(game);
    setStatus(game.status);
  }

  function handleGuess(guess: Song) {
    socket.emit('guess', guess);
  }

  React.useEffect(() => {
    socket.on('connect', () => {
      setStatus('loading');
    });
    socket.on('disconnect', () => setStatus('disconnected'));

    socket.on('timeout', () => console.log('TIMEOUT'));
    socket.on('game', onGame);
  }, []);

  const matchTitle = (game && game.guessedTitles.includes(user)) || false;
  const matchAuthor = (game && game.guessedAuthors.includes(user)) || false;

  return (
    <main>
      {status === 'init' && <ConnectScreen onConnect={handleConnect} />}
      {status === 'disconnected' && <DisconnectedScreen />}
      {status === 'loading' && <LoadingScreen />}
      {Boolean(game?.players?.length) && (
        <ul className="nes-list is-disc" id="players">
          {game?.players.map(player => (
            <li key={player.id}>
              <span style={{ marginRight: 10 }}>{player.name}</span>
              <span>{`  ${player.points}Pts.  `}</span>
              {game.guessedAuthors.includes(player.name) && (
                <span className="nes-text is-error">*</span>
              )}
              {game.guessedTitles.includes(player.name) && (
                <span className="nes-text is-primary">*</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {game && status === 'playing' && (
        <PlayingScreen
          song={game.song}
          onGuess={handleGuess}
          matchT={matchTitle}
          matchA={matchAuthor}
        />
      )}
      {game && status === 'finished' && (
        <FinishedScreen song={game.song} winner={game.winner} />
      )}
    </main>
  );
}

export default App;
