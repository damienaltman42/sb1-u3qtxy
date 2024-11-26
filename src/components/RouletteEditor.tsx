import React, { useState } from 'react';
import type { RouletteItem } from '../types';
import EditorPreview from './roulette-editor/EditorPreview';
import PrizeList from './roulette-editor/PrizeList';
import EditorControls from './roulette-editor/EditorControls';

interface RouletteEditorProps {
  initialItems?: RouletteItem[];
  onSave: (items: RouletteItem[]) => void;
  onCancel: () => void;
}

const COLORS = [
  '#FF69B4', '#9370DB', '#FF1493', '#8A2BE2', '#DA70D6',
  '#BA55D3', '#FF69B4', '#9370DB', '#FF1493', '#8A2BE2'
];

const RouletteEditor: React.FC<RouletteEditorProps> = ({ initialItems, onSave, onCancel }) => {
  const [items, setItems] = useState<RouletteItem[]>(initialItems || [
    { id: '1', text: 'Prize 1', color: COLORS[0], probability: 1 }
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<RouletteItem | null>(null);

  const addItem = () => {
    const newItem: RouletteItem = {
      id: String(items.length + 1),
      text: `Prize ${items.length + 1}`,
      color: COLORS[items.length % COLORS.length],
      probability: 1 / (items.length + 1)
    };
    
    const newItems = items.map(item => ({
      ...item,
      probability: 1 / (items.length + 1)
    }));
    
    setItems([...newItems, newItem]);
  };

  const updateItem = (index: number, updates: Partial<RouletteItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      const updatedItems = newItems.map(item => ({
        ...item,
        probability: 1 / newItems.length
      }));
      setItems(updatedItems);
    }
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinComplete = (item: RouletteItem) => {
    setIsSpinning(false);
    setWinner(item);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <EditorPreview
        items={items}
        isSpinning={isSpinning}
        winner={winner}
        onSpin={handleSpin}
        onSpinComplete={handleSpinComplete}
      />

      <div className="bg-white rounded-lg p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Customize Prizes</h3>
        
        <PrizeList
          items={items}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />

        <EditorControls
          onAddItem={addItem}
          onSave={() => onSave(items)}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default RouletteEditor;