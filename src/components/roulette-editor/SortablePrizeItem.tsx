import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import ColorPicker from './ColorPicker';
import type { RouletteItem } from '../../types';

interface SortablePrizeItemProps {
  item: RouletteItem;
  onUpdate: (updates: Partial<RouletteItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const SortablePrizeItem: React.FC<SortablePrizeItemProps> = ({
  item,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-purple-200 transition-colors"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <ColorPicker
        color={item.color}
        onColorSelect={(color) => onUpdate({ color })}
      />
      
      <input
        type="text"
        value={item.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        className="flex-1 px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
        placeholder="Enter prize name"
      />
      
      {canRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          title="Remove prize"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};