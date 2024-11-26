import React, { useState } from 'react';
import { Copy, Plus, Trash2, Lock } from 'lucide-react';
import { codes } from '../../lib/api';
import type { AccessCode, SubscriptionTier } from '../../types';

interface AccessCodeGeneratorProps {
  codes: AccessCode[];
  onUpdate: (codes: AccessCode[]) => void;
  subscriptionTier: SubscriptionTier;
  spinsUsedThisMonth: number;
  onUpgradeClick: () => void;
  rouletteId?: string;
}

const AccessCodeGenerator: React.FC<AccessCodeGeneratorProps> = ({
  codes: existingCodes,
  onUpdate,
  subscriptionTier,
  spinsUsedThisMonth,
  onUpgradeClick,
  rouletteId
}) => {
  const [spins, setSpins] = useState('1');
  const [expiresIn, setExpiresIn] = useState('7');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [localSpinsUsed, setLocalSpinsUsed] = useState(spinsUsedThisMonth);
  const remainingSpins = subscriptionTier.features.maxSpinsPerMonth - localSpinsUsed;

  const generateCode = async () => {
    if (!rouletteId) return;
    
    const totalSpins = parseInt(spins);
    if (totalSpins > remainingSpins) {
      setError('Not enough spins remaining this month');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const newCode = await codes.create(rouletteId, {
        spins: totalSpins,
        expiresIn: parseInt(expiresIn)
      });

      // Update local spins counter
      setLocalSpinsUsed(prev => prev + totalSpins);
      onUpdate([...existingCodes, newCode]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate code');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const deleteCode = async (id: string) => {
    const codeToDelete = existingCodes.find(code => code.id === id);
    if (!codeToDelete) return;

    try {
      await codes.delete(id);
      
      // Restore spins when deleting a code
      setLocalSpinsUsed(prev => prev - codeToDelete.totalSpins);
      onUpdate(existingCodes.filter(code => code.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete code');
    }
  };

  const isGenerateDisabled = isGenerating || 
    !rouletteId || 
    parseInt(spins) <= 0 || 
    parseInt(spins) > remainingSpins || 
    parseInt(expiresIn) <= 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Access Codes</h3>
        <span className="text-sm text-gray-500">
          {remainingSpins} spins remaining this month
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Code Generator */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Spins:</label>
            <input
              type="number"
              min="1"
              max={remainingSpins}
              value={spins}
              onChange={(e) => setSpins(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expires in:</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                min="1"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="flex-1 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                days
              </span>
            </div>
          </div>
        </div>

        {remainingSpins > 0 ? (
          <button
            onClick={generateCode}
            disabled={isGenerateDisabled}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </button>
        ) : (
          <div 
            onClick={onUpgradeClick}
            className="flex items-center justify-center p-4 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors"
          >
            <Lock className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-sm text-purple-700">
              Upgrade your plan to add more spins!
            </span>
          </div>
        )}
      </div>

      {/* Code List */}
      <div className="space-y-3">
        {existingCodes.map((code) => (
          <div
            key={code.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div>
              <code className="text-lg font-mono font-semibold text-purple-600">
                {code.code}
              </code>
              <p className="text-sm text-gray-500 mt-1">
                {code.spinsLeft}/{code.totalSpins} spins remaining
              </p>
              {code.expiresAt && (
                <p className="text-sm text-gray-500">
                  Expires: {new Date(code.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => copyCode(code.code)}
                className="p-2 text-gray-400 hover:text-purple-600"
                title="Copy code"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteCode(code.id)}
                className="p-2 text-gray-400 hover:text-red-600"
                title="Delete code"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessCodeGenerator;