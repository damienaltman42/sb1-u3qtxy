import React from 'react';
import Roulette from '../Roulette';
import WinnerDisplay from './WinnerDisplay';
import type { RouletteItem } from '../../types';

interface EditorPreviewProps {
  items: RouletteItem[];
  isSpinning: boolean;
  winner: RouletteItem | null;
  onSpin: () => void;
  onSpinComplete: (item: RouletteItem) => void;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({
  items,
  isSpinning,
  winner,
  onSpin,
  onSpinComplete
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-xl font-semibold mb-4 text-white">Preview</h3>
      <div className="w-full max-w-md">
        <Roulette
          items={items}
          onSpinComplete={onSpinComplete}
          isSpinning={isSpinning}
          onSpin={onSpin}
        />
        
        {winner && <WinnerDisplay winner={winner} />}
      </div>
    </div>
  );
};

export default EditorPreview;