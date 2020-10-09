import React from 'react';

interface Props {
  copy: string;
  role: string;
}

const SplitText: React.FC<Props> = ({ copy, role }) => {
  return (
    <span aria-label={copy} role={role}>
      {copy.split('').map(function (char, index) {
        const style = { animationDelay: 0.5 + index / 10 + 's' };
        return (
          <span aria-hidden="true" key={index} style={style}>
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default SplitText;
