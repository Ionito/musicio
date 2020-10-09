import React from 'react';

import { Game } from '../types';

interface Props {
  song: Game['song'];
  winner: Game['winner'];
}

const FinishedScreen: React.FC<Props> = ({ song, winner }) => {
  return (
    <>
      <h1>{winner && winner?.length > 0 ? winner[0] : 'Nadie'} adivinó!</h1>
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
