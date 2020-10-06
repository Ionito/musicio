import React from 'react';
import io from 'socket.io-client';

import ConnectScreen from './screens/Connect';
import DisconnectedScreen from './screens/Disconnected';
import FinishedScreen from './screens/Finished';
import LoadingScreen from './screens/Loading';
import PlayingScreen from './screens/Playing';
import { Game } from './types';

const socket = io(process.env.REACT_APP_SERVER_URL || '/', {
  autoConnect: false,
});

function App() {
  const [game, setGame] = React.useState<null | Game>(null);
  const [status, setStatus] = React.useState<Game['status']>('init');

  function handleConnect(name: string, room: string) {
    console.log('PUERTO', process.env.REACT_APP_SERVER_URL);
    socket.io.opts.query = {
      name,
      room,
    };

    socket.open();
  }

  function onGame(game: any) {
    console.log(game);
    setGame(game);
    setStatus(game.status);
  }

  function handleGuess(guess: string) {
    socket.emit('guess', guess);
  }

  React.useEffect(() => {
    socket.on('connect', () => setStatus('loading'));
    socket.on('disconnect', () => setStatus('disconnected'));

    socket.on('timeout', () => console.log('TIMEOUT'));

    socket.on('game', onGame);
  }, []);

  return (
    <main>
      {status === 'init' && <ConnectScreen onConnect={handleConnect} />}
      {status === 'disconnected' && <DisconnectedScreen />}
      {status === 'loading' && <LoadingScreen />}
      {Boolean(game?.players?.length) && (
        <ul className="nes-list is-disc" id="players">
          {game?.players.map(player => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      )}
      {game && status === 'playing' && (
        <PlayingScreen song={game.song} onGuess={handleGuess} />
      )}
      {game && status === 'finished' && (
        <FinishedScreen song={game.songTitle} winner={game.winner} />
      )}
    </main>
  );
}

export default App;
