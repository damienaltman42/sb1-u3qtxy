import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import type { RouletteItem, PricePackage, AccessCode, SubscriptionTier } from '../../types';
import EditorPreview from './EditorPreview';
import PrizeList from './PrizeList';
import PricingEditor from './PricingEditor';
import AccessCodeGenerator from './AccessCodeGenerator';
import { PRESET_COLORS } from '../../lib/constants/colors';

interface RouletteEditorProps {
  initialItems?: RouletteItem[];
  initialPackages?: PricePackage[];
  initialCodes?: AccessCode[];
  initialTitle?: string;
  rouletteId?: string;
  subscriptionTier: SubscriptionTier;
  spinsUsedThisMonth: number;
  onSave: (data: { 
    items: RouletteItem[]; 
    packages: PricePackage[]; 
    codes: AccessCode[];
    title: string;
  }) => void;
  onCancel: () => void;
}

const RouletteEditor: React.FC<RouletteEditorProps> = ({
  initialItems,
  initialPackages = [],
  initialCodes = [],
  initialTitle = '',
  rouletteId,
  subscriptionTier,
  spinsUsedThisMonth,
  onSave,
  onCancel
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [items, setItems] = useState<RouletteItem[]>(initialItems || [
    { id: '1', text: 'Prize 1', color: PRESET_COLORS[0], probability: 1 }
  ]);
  const [packages, setPackages] = useState<PricePackage[]>(initialPackages);
  const [codes, setCodes] = useState<AccessCode[]>(initialCodes);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<RouletteItem | null>(null);

  const handleAddItem = () => {
    const newItem: RouletteItem = {
      id: String(items.length + 1),
      text: `Prize ${items.length + 1}`,
      color: PRESET_COLORS[items.length % PRESET_COLORS.length],
      probability: 1 / (items.length + 1)
    };
    
    const newItems = items.map(item => ({
      ...item,
      probability: 1 / (items.length + 1)
    }));
    
    setItems([...newItems, newItem]);
  };

  const handleUpdateItem = (index: number, updates: Partial<RouletteItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      const updatedItems = newItems.map(item => ({
        ...item,
        probability: 1 / newItems.length
      }));
      setItems(updatedItems);
    }
  };

  const handleReorderItems = (reorderedItems: RouletteItem[]) => {
    setItems(reorderedItems);
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
      {/* Left Column - Editor Sections */}
      <div className="space-y-6">
        {/* Title Input */}
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roulette Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your roulette"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Prize Editor */}
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customize Prizes</h3>
          </div>
          
          <PrizeList
            items={items}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onReorderItems={handleReorderItems}
          />

          <button
            onClick={handleAddItem}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Prize
          </button>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <PricingEditor
            packages={packages}
            onUpdate={setPackages}
            subscriptionTier={subscriptionTier}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        </div>

        {/* Access Codes Section */}
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <AccessCodeGenerator
            codes={codes}
            onUpdate={setCodes}
            subscriptionTier={subscriptionTier}
            spinsUsedThisMonth={spinsUsedThisMonth}
            onUpgradeClick={() => setShowUpgradeModal(true)}
            rouletteId={rouletteId}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ items, packages, codes, title })}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Roulette
          </button>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:sticky lg:top-8 space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <EditorPreview
            items={items}
            isSpinning={isSpinning}
            winner={winner}
            onSpin={handleSpin}
            onSpinComplete={handleSpinComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default RouletteEditor;