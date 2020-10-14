import React from 'react';

import SplitText from '../components/SplitText';

interface Props {
  onConnect: (name: string, room: string) => void;
}

const ConnectScreen: React.FC<Props> = ({ onConnect }) => {
  const [error, setError] = React.useState<null | string>(null);
  const [name, setName] = React.useState<string>('');
  const [room, setRoom] = React.useState<string>('');

  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name) {
      return setError('Name is required');
    }

    if (!room) {
      return setError('Room is required');
    }

    onConnect(name, room);
  }

  return (
    <>
      <h1>
        <SplitText copy="Fiestita de 15" role="heading" />
      </h1>
      <form className="nes-container with-title" onSubmit={handleSubmit}>
        <div className="nes-field">
          <label>Tu nombre</label>
          <input
            className="nes-input"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div className="nes-field" style={{ marginTop: 24 }}>
          <label>Nombre de Sala</label>
          <input
            className="nes-input"
            type="text"
            value={room}
            onChange={event => setRoom(event.target.value)}
          />
        </div>
        {error && (
          <div
            className="nes-text is-error"
            style={{ marginTop: 12, marginBottom: 0 }}
          >
            {error}
          </div>
        )}
        <button
          className="nes-btn is-primary"
          style={{ width: '100%', marginTop: 24 }}
          type="submit"
        >
          Conectarse
        </button>
      </form>
    </>
  );
};

export default ConnectScreen;
