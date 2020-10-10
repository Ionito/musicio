import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

import UserList from './components/UserList';
import ConnectScreen from './screens/Connect';
import DisconnectedScreen from './screens/Disconnected';
import FinishAllScreen from './screens/FinishAll';
import FinishedScreen from './screens/Finished';
import LoadingScreen from './screens/Loading';
import PlayingScreen from './screens/Playing';
import { Game, Song } from './types';

const socket = io(process.env.REACT_APP_SERVER_URL || '/', {
  autoConnect: false,
});

const TIMER_TOTAL = 2 * 60; // sec

function App() {
  const [game, setGame] = useState<null | Game>(null);
  const [status, setStatus] = useState<Game['status']>('init');
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');
  const [counter, setCounter] = useState(TIMER_TOTAL);
  const [start, setStart] = useState(false);
  const timer = useRef<NodeJS.Timeout | false>(false);
  const valueCounter = (100 / TIMER_TOTAL) * counter;

  function handleConnect(name: string, room: string) {
    setUser(name);
    const roomNormal = room.toLowerCase();
    socket.io.opts.query = {
      name,
      room: roomNormal,
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

  useEffect(() => {
    if (start === true) {
      timer.current =
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }

    console.log(counter);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [start, counter, setCounter]);

  React.useEffect(() => {
    socket.on('connect', () => {
      setStatus('loading');
      console.log('SESSIONID', socket.id);
      setUserId(socket.id);
    });
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('startTimer', () => {
      console.log('start timer');
      setStart(true);
    });
    socket.on('timeout', () => {
      setStart(false);
      setCounter(TIMER_TOTAL);
    });
    socket.on('game', onGame);
  }, []);

  const matchTitle = (game && game.guessedTitles.includes(userId)) || false;
  const matchAuthor = (game && game.guessedAuthors.includes(userId)) || false;

  return (
    <main>
      {status === 'init' && <ConnectScreen onConnect={handleConnect} />}
      {status === 'disconnected' && <DisconnectedScreen />}
      {status === 'loading' && <LoadingScreen />}
      {Boolean(game?.players?.length) && <UserList game={game} />}
      {game && status === 'playing' && (
        <div id="info-right">
          <progress
            className="progress-counter nes-progress is-error"
            value={valueCounter}
            max="100"
          >
            tiempo
          </progress>
          <div>{`Round ${game.round} `}</div>
        </div>
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
        <FinishedScreen
          song={game.song}
          winner={game.winner}
          players={game.players}
        />
      )}
      {game && status === 'finishAll' && (
        <FinishAllScreen players={game.players} />
      )}
    </main>
  );
}

export default App;
