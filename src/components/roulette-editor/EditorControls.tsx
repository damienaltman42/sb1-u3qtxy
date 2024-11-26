import React from 'react';
import { Plus, Save } from 'lucide-react';

interface EditorControlsProps {
  onAddItem: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({ onAddItem, onSave, onCancel }) => {
  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={onAddItem}
        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Prize
      </button>

      <div className="flex space-x-3">
        <button
          onClick={onSave}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Roulette
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditorControls;