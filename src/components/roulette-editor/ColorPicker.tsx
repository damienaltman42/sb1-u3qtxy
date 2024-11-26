import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onColorSelect: (color: string) => void;
}

const PRESET_COLORS = [
  '#FF69B4', '#9370DB', '#FF1493', '#8A2BE2', '#DA70D6',
  '#BA55D3', '#FF69B4', '#9370DB', '#FF1493', '#8A2BE2'
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onColorSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
        title="Change color"
      >
        <Palette className="w-4 h-4 text-white opacity-75" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-10 z-50 bg-white rounded-lg shadow-xl p-3 space-y-3">
          <HexColorPicker color={color} onChange={onColorSelect} />
          
          <div className="grid grid-cols-5 gap-1 pt-2 border-t border-gray-200">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                className="w-6 h-6 rounded-md hover:scale-110 transition-transform border-2 border-white shadow-sm"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onColorSelect(presetColor);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ColorPicker;