import React from 'react';
import type { RouletteItem } from '../../types';

interface WinnerDisplayProps {
  winner: RouletteItem;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner }) => {
  return (
    <div className="mt-6 bg-white rounded-lg p-4 text-center shadow-xl">
      <h4 className="text-lg font-semibold mb-2">🎉 Test Result</h4>
      <p>Winner: <span className="font-bold text-purple-600">{winner.text}</span></p>
    </div>
  );
};

export default WinnerDisplay;