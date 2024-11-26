import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePrizeItem } from './SortablePrizeItem';
import type { RouletteItem } from '../../types';

interface PrizeListProps {
  items: RouletteItem[];
  onUpdateItem: (index: number, updates: Partial<RouletteItem>) => void;
  onRemoveItem: (index: number) => void;
  onReorderItems?: (items: RouletteItem[]) => void;
}

const PrizeList: React.FC<PrizeListProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onReorderItems,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && onReorderItems) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      onReorderItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((item, index) => (
            <SortablePrizeItem
              key={item.id}
              item={item}
              onUpdate={(updates) => onUpdateItem(index, updates)}
              onRemove={() => onRemoveItem(index)}
              canRemove={items.length > 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PrizeList;