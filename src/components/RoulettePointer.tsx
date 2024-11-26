import React from 'react';

interface RoulettePointerProps {
  center: number;
}

const RoulettePointer: React.FC<RoulettePointerProps> = ({ center }) => {
  return (
    <g transform={`translate(${center}, 20)`}>
      <path
        d="M -15,0 L 15,0 L 0,25 Z"
        fill="url(#pointerGradient)"
        stroke="white"
        strokeWidth="3"
        filter="url(#shadow)"
        className="pointer-events-none"
      />
    </g>
  );
};

export default RoulettePointer;