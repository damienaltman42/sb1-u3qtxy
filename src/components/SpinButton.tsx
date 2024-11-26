import React from 'react';
import { Lock } from 'lucide-react';

interface SpinButtonProps {
  onSpin: () => void;
  isSpinning: boolean;
  disabled?: boolean;
}

const SpinButton: React.FC<SpinButtonProps> = ({ onSpin, isSpinning, disabled }) => {
  return (
    <>
      <circle
        r="35"
        fill="white"
        stroke="#E5E7EB"
        strokeWidth="2"
        filter="url(#shadow)"
        className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        onClick={disabled ? undefined : onSpin}
      />
      <foreignObject x="-25" y="-25" width="50" height="50">
        <div className="w-full h-full flex items-center justify-center">
          <button
            onClick={onSpin}
            disabled={isSpinning || disabled}
            className={`w-full h-full rounded-full text-white font-bold text-xs focus:outline-none disabled:opacity-50 flex items-center justify-center ${
              disabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            }`}
          >
            {isSpinning ? (
              '...'
            ) : disabled ? (
              <Lock className="w-4 h-4" />
            ) : (
              'SPIN'
            )}
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default SpinButton;