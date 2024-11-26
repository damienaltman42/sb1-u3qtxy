import React from 'react';
import type { RouletteItem } from '../../types';

interface RouletteSliceProps {
  item: RouletteItem;
  index: number;
  radius: number;
  anglePerItem: number;
  isActive?: boolean;
}

const RouletteSlice: React.FC<RouletteSliceProps> = ({ item, index, radius, anglePerItem, isActive }) => {
  // Ajuster l'angle de départ pour commencer à -90° (haut)
  const angle = (index * anglePerItem) - 90;
  const startAngle = (angle - anglePerItem/2) * Math.PI/180;
  const endAngle = (angle + anglePerItem/2) * Math.PI/180;
  
  const x1 = radius * Math.cos(startAngle);
  const y1 = radius * Math.sin(startAngle);
  const x2 = radius * Math.cos(endAngle);
  const y2 = radius * Math.sin(endAngle);
  
  const largeArcFlag = anglePerItem > 180 ? 1 : 0;
  
  const pathD = `
    M 0 0
    L ${x1} ${y1}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
    Z
  `;

  // Calculate text position
  const textRadius = radius * 0.65;
  const midAngle = (startAngle + endAngle) / 2;
  const textX = textRadius * Math.cos(midAngle);
  const textY = textRadius * Math.sin(midAngle);
  
  // Calculate text rotation to make it radial and always readable
  const degrees = (midAngle * 180) / Math.PI;
  let textRotation = degrees;
  
  // Adjust text rotation to always be readable
  if (degrees > 90 && degrees < 270) {
    textRotation += 180;
  }

  return (
    <g>
      <path
        d={pathD}
        fill={item.color}
        className={`transition-colors duration-200 ${isActive ? 'brightness-125' : 'hover:brightness-110'}`}
        filter="url(#shadow)"
      />
      <g transform={`translate(${textX},${textY})`}>
        <text
          className={`text-sm font-medium fill-white transition-all duration-200 ${isActive ? 'font-bold' : ''}`}
          transform={`rotate(${textRotation})`}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: '11px',
            letterSpacing: '0.05em'
          }}
        >
          {item.text}
        </text>
      </g>
    </g>
  );
};

export default RouletteSlice;