import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import type { RouletteProps } from '../types';
import RouletteSlice from './RouletteSlice';
import RoulettePointer from './RoulettePointer';
import SpinButton from './SpinButton';

const Roulette: React.FC<RouletteProps> = ({ 
  items = [], 
  onSpinComplete, 
  isSpinning, 
  onSpin, 
  disabled 
}) => {
  const wheelRef = useRef<SVGGElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const radius = 200;
  const center = radius + 20;
  const size = (center + 20) * 2;
  const anglePerItem = items.length > 0 ? 360 / items.length : 360;

  const getWinningIndex = (rotation: number): number => {
    if (items.length === 0) return 0;
    
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const adjustedRotation = (normalizedRotation + 90) % 360;
    return Math.floor(adjustedRotation / anglePerItem) % items.length;
  };

  useEffect(() => {
    if (isSpinning && wheelRef.current && items.length > 0) {
      const currentRotation = gsap.getProperty(wheelRef.current, "rotation") as number || 0;
      
      const randomSpins = 5 + Math.random() * 5;
      const randomAngle = Math.random() * 360;
      const totalRotation = currentRotation + (360 * randomSpins + randomAngle);

      gsap.to(wheelRef.current, {
        rotation: totalRotation,
        duration: 5,
        ease: "power2.out",
        transformOrigin: "50% 50%",
        onUpdate: () => {
          const currentRotation = gsap.getProperty(wheelRef.current, "rotation") as number;
          const index = getWinningIndex(currentRotation);
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        },
        onComplete: () => {
          const finalRotation = gsap.getProperty(wheelRef.current, "rotation") as number;
          const winningIndex = getWinningIndex(finalRotation);
          onSpinComplete(items[winningIndex]);
        }
      });
    }
  }, [isSpinning, items, anglePerItem, onSpinComplete, currentIndex]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No prizes available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-square relative">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodOpacity="0.5"/>
            </filter>
            <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF69B4" />
              <stop offset="100%" stopColor="#9370DB" />
            </linearGradient>
          </defs>

          <g 
            ref={wheelRef} 
            transform={`translate(${center},${center})`}
          >
            {items.map((item, index) => (
              <RouletteSlice
                key={item.id}
                item={item}
                index={index}
                radius={radius}
                anglePerItem={anglePerItem}
                isActive={index === currentIndex}
              />
            ))}

            <SpinButton 
              onSpin={onSpin} 
              isSpinning={isSpinning} 
              disabled={disabled || items.length === 0} 
            />
          </g>

          <RoulettePointer center={center} />
        </svg>
      </div>
    </div>
  );
};

export default Roulette;