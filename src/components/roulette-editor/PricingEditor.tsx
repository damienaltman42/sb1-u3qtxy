import React, { useState } from 'react';
import { Plus, Star, Trash2, Lock } from 'lucide-react';
import type { PricePackage, SubscriptionTier } from '../../types';

interface PricingEditorProps {
  packages: PricePackage[];
  onUpdate: (packages: PricePackage[]) => void;
  subscriptionTier: SubscriptionTier;
  onUpgradeClick: () => void;
}

const PricingEditor: React.FC<PricingEditorProps> = ({ 
  packages, 
  onUpdate, 
  subscriptionTier,
  onUpgradeClick 
}) => {
  const handleAddPackage = () => {
    if (packages.length >= subscriptionTier.features.maxPackagesPerRoulette) {
      return;
    }

    const newPackage: PricePackage = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      spins: 1,
      description: '', // Initialize with empty string instead of undefined
      isPopular: false
    };

    onUpdate([...packages, newPackage]);
  };

  const handleUpdatePackage = (id: string, updates: Partial<PricePackage>) => {
    onUpdate(packages.map(pkg => 
      pkg.id === id ? { ...pkg, ...updates } : pkg
    ));
  };

  const handleDeletePackage = (id: string) => {
    onUpdate(packages.filter(pkg => pkg.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Pricing Packages</h3>
        <span className="text-sm text-gray-500">
          {packages.length}/{subscriptionTier.features.maxPackagesPerRoulette} packages used
        </span>
      </div>

      <div className="space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg border border-gray-200 p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1 mr-4">
                <div>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handleUpdatePackage(pkg.id, { name: e.target.value })}
                    placeholder="Package name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pkg.price}
                      onChange={(e) => handleUpdatePackage(pkg.id, { price: parseFloat(e.target.value) })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Spins</label>
                    <input
                      type="number"
                      min="1"
                      value={pkg.spins}
                      onChange={(e) => handleUpdatePackage(pkg.id, { spins: parseInt(e.target.value) })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={pkg.description || ''} // Ensure value is never undefined
                    onChange={(e) => handleUpdatePackage(pkg.id, { description: e.target.value })}
                    placeholder="Package description (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`popular-${pkg.id}`}
                    checked={pkg.isPopular || false} // Ensure checked is never undefined
                    onChange={(e) => handleUpdatePackage(pkg.id, { isPopular: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`popular-${pkg.id}`} className="ml-2 text-sm text-gray-700">
                    Mark as popular
                  </label>
                </div>
              </div>

              <button
                onClick={() => handleDeletePackage(pkg.id)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {packages.length < subscriptionTier.features.maxPackagesPerRoulette ? (
          <button
            onClick={handleAddPackage}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </button>
        ) : (
          <div 
            onClick={onUpgradeClick}
            className="flex items-center justify-center p-4 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors"
          >
            <Lock className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-sm text-purple-700">
              Upgrade your plan to add more packages
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingEditor;