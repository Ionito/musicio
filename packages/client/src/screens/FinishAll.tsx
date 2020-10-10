import React from 'react';

import SplitText from '../components/SplitText';
import { Game } from '../types';

interface Props {
  players: Game['players'];
}

const FinishAll: React.FC<Props> = ({ players }) => {
  const getHighScorePlayer = (allPlayers: Game['players']) => {
    return allPlayers.reduce(function (prev, current) {
      return prev.points > current.points ? prev : current;
    });
  };
  const ganador = getHighScorePlayer(players);
  return (
    <div>
      <p style={{ width: 370 }}>
        Se prenden las luces.. suena Brillante sobre el Mic .. significa que..
        se terminó la fiestita!
      </p>
      <h1>
        <SplitText copy={ganador.name} role="heading" />
      </h1>
      <h1>es el ganador</h1>
      <h1>{`con ${ganador.points} puntos`}</h1>
      <p style={{ width: 370 }}>
        El juego volvera a empezar nuevamente en 30 segundos :-)
      </p>
    </div>
  );
};

export default FinishAll;
