import React from 'react';
import { Trash2 } from 'lucide-react';
import ColorPicker from './ColorPicker';
import type { RouletteItem } from '../../types';

interface PrizeItemProps {
  item: RouletteItem;
  onUpdate: (updates: Partial<RouletteItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const PrizeItem: React.FC<PrizeItemProps> = ({ item, onUpdate, onRemove, canRemove }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <ColorPicker
        color={item.color}
        onColorSelect={(color) => onUpdate({ color })}
      />
      
      <input
        type="text"
        value={item.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        className="flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Enter prize name"
      />
      
      <button
        onClick={onRemove}
        className="p-1 text-gray-500 hover:text-red-500"
        disabled={!canRemove}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PrizeItem;