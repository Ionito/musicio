import React from 'react';

interface Props {
  onStart: () => void;
  isAdmin: boolean;
}

const LoadingScreen: React.FC<Props> = ({ onStart, isAdmin }) => {
  return (
    <>
      <p style={{ width: 420, textAlign: 'center', margin: 'auto' }}>
        Esperando a que esten todos los participantes listos...
      </p>
      <p style={{ width: 660, textAlign: 'center', margin: 'auto 10px' }}>
        Reglas de juego: <br />Y el juego conta de 15 rondas. Se puede adivinar
        tanto el titulo del tema como el autor. Una vez que adivinan ambos la
        mitad de los participantes se avanzará al tema siguiente. El máximo de
        tiempo para adivinar son dos minutos.
      </p>
      {isAdmin && (
        <>
          <p style={{ width: 460, textAlign: 'center', margin: 'auto 10px' }}>
            Sos el admin, dale click a comenzar cuando esten todos listos
          </p>
          <button
            className="nes-btn is-primary" //is-disabled
            onClick={onStart}
            style={{ marginTop: 15 }}
          >
            Comenzar
          </button>
        </>
      )}
    </>
  );
};

export default LoadingScreen;
