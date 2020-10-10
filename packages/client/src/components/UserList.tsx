import React from 'react';

import { Game } from '../types';
interface Props {
  game: Game | null;
}

const UserList: React.FC<Props> = ({ game }) => {
  return (
    <ul className="nes-list is-disc player-list" id="players">
      {game?.players.map(player => (
        <li key={player.id}>
          <div className="list-player-name">{player.name}</div>
          <div className="list-player-info">
            <span>{`${player.points} `}</span>
            {game.guessedAuthors.includes(player.id) && (
              <span className="nes-text is-error">*</span>
            )}
            {game.guessedTitles.includes(player.id) && (
              <span className="nes-text is-primary">*</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
