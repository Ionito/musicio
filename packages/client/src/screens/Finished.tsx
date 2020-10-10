import React from 'react';

import { Game } from '../types';

interface Props {
  song: Game['song'];
  winner: Game['winner'];
  players: Game['players'];
}

const FinishedScreen: React.FC<Props> = ({ song, winner, players }) => {
  const getPlayerName = (playerId: string) => {
    return players.find(player => player.id === playerId)?.name || 'Montoto';
  };
  return (
    <>
      <h1>
        {winner && winner?.length > 0 ? getPlayerName(winner[0]) : 'Nadie'}{' '}
        adivinó!
      </h1>
      <h2>La canción se llamaba:</h2>
      <h2 style={{ color: 'red' }}>{song.title}</h2>
      <h2>Y el autor de la misma</h2>
      <h2 style={{ color: 'red' }}>{song.author}</h2>
      {/* <h2>El año que fué hecha</h2>
      <h4>Winner: {winner}</h4> */}
    </>
  );
};

export default FinishedScreen;
