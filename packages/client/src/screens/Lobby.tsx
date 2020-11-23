import React from 'react';

interface Props {
  onStart: () => void;
  isAdmin: boolean;
}

const LoadingScreen: React.FC<Props> = ({ onStart, isAdmin }) => {
  return (
    <>
      <div
        className="nes-container with-title is-centered"
        style={{ margin: '60px 0px 20px' }}
      >
        <p className="title">ATENCIÓN</p>
        <p>Recomendamos jugar en PC y con auriculares</p>
      </div>
      <p
        style={{
          width: 500,
          textAlign: 'center',
          margin: '10px 5px',
          color: 'red',
        }}
      >
        Esperando a que esten todos los participantes listos...
      </p>
      <p style={{ width: 800, textAlign: 'center', margin: '10px 5px' }}>
        Reglas de juego: <br />Y el juego conta de 15 rondas. Se puede adivinar
        tanto el titulo del tema como el autor. Una vez que adivinan ambos la
        mitad de los participantes se avanzará al tema siguiente. El máximo de
        tiempo para adivinar son dos minutos.
      </p>
      {isAdmin && (
        <>
          <p style={{ width: 560, textAlign: 'center', margin: '40px 5px' }}>
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
