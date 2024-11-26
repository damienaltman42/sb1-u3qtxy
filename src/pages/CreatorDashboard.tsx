import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Share2, Trash2, Edit2, Settings, Lock } from 'lucide-react';
import type { RouletteConfig, RouletteItem, SubscriptionTier } from '../types';
import { roulettes } from '../lib/api';
import RouletteEditor from '../components/roulette-editor/RouletteEditor';
import SubscriptionPlans from '../components/subscription/SubscriptionPlans';
import { SUBSCRIPTION_TIERS } from '../lib/constants/subscriptionTiers';

const CreatorDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userRoulettes, setRoulettes] = useState<RouletteConfig[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoulette, setEditingRoulette] = useState<RouletteConfig | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [spinsUsedThisMonth, setSpinsUsedThisMonth] = useState(0);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SUBSCRIPTION_TIERS[0]);

  useEffect(() => {
    if (!user) {
      navigate('/creator/login');
      return;
    }
    loadRoulettes();
  }, [user, navigate]);

  const loadRoulettes = async () => {
    try {
      const data = await roulettes.getAll();
      // Parse packages JSON if it's a string
      const processedData = data.map((roulette: RouletteConfig) => ({
        ...roulette,
        packages: typeof roulette.packages === 'string' ? JSON.parse(roulette.packages) : roulette.packages,
        items: typeof roulette.items === 'string' ? JSON.parse(roulette.items) : roulette.items
      }));
      setRoulettes(processedData);
      
      // Calculate total spins used this month
      const totalSpins = processedData.reduce((total, roulette) => {
        const codes = roulette.accessCodes || [];
        return total + codes.reduce((rouletteTotal, code) => {
          const codeDate = new Date(code.createdAt);
          const now = new Date();
          if (codeDate.getMonth() === now.getMonth() && codeDate.getFullYear() === now.getFullYear()) {
            return rouletteTotal + code.totalSpins;
          }
          return rouletteTotal;
        }, 0);
      }, 0);
      
      setSpinsUsedThisMonth(totalSpins);
    } catch (error) {
      console.error('Error loading roulettes:', error);
    }
  };

  const handleCreateRoulette = async (data: {
    items: RouletteItem[];
    packages: any[];
    codes: any[];
    title: string;
  }) => {
    if (userRoulettes.length >= currentTier.features.maxRoulettes) {
      return;
    }

    try {
      const newRoulette = await roulettes.create({
        name: data.title,
        items: data.items,
        packages: data.packages,
        accessCodes: data.codes
      });
      
      setRoulettes([...userRoulettes, newRoulette]);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating roulette:', error);
    }
  };

  const handleUpdateRoulette = async (data: {
    items: RouletteItem[];
    packages: any[];
    codes: any[];
    title: string;
  }) => {
    if (!editingRoulette) return;
    
    try {
      const updatedRoulette = await roulettes.update(editingRoulette.id, {
        name: data.title,
        items: data.items,
        packages: data.packages,
        accessCodes: data.codes
      });

      setRoulettes(userRoulettes.map(r => 
        r.id === editingRoulette.id ? updatedRoulette : r
      ));
      setEditingRoulette(null);
    } catch (error) {
      console.error('Error updating roulette:', error);
    }
  };

  const deleteRoulette = async (id: string) => {
    try {
      await roulettes.delete(id);
      setRoulettes(userRoulettes.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting roulette:', error);
    }
  };

  const copyShareLink = (roulette: RouletteConfig) => {
    const url = `${window.location.origin}/roulette/${roulette.id}`;
    navigator.clipboard.writeText(url);
  };

  const handleSubscriptionChange = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    setShowSubscription(false);
  };

  if (showSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Subscription Plans</h2>
          <SubscriptionPlans
            currentTier={currentTier}
            onSelect={handleSubscriptionChange}
          />
        </div>
      </div>
    );
  }

  if (isCreating || editingRoulette) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            {isCreating ? 'Create New Roulette' : 'Edit Roulette'}
          </h2>
          <RouletteEditor
            initialItems={editingRoulette?.items}
            initialPackages={editingRoulette?.packages || []}
            initialCodes={editingRoulette?.accessCodes || []}
            initialTitle={editingRoulette?.name}
            subscriptionTier={currentTier}
            spinsUsedThisMonth={spinsUsedThisMonth}
            onSave={isCreating ? handleCreateRoulette : handleUpdateRoulette}
            onCancel={() => {
              setIsCreating(false);
              setEditingRoulette(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
              <p className="text-gray-300">{currentTier.name} Plan</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSubscription(true)}
              className="px-4 py-2 text-white bg-white/10 rounded-md hover:bg-white/20"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-white bg-white/10 rounded-md hover:bg-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white/10 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Subscription Status</h2>
              <p className="text-gray-300">
                {spinsUsedThisMonth} / {currentTier.features.maxSpinsPerMonth === Infinity ? '∞' : currentTier.features.maxSpinsPerMonth} spins used this month
              </p>
              <p className="text-gray-300">
                {userRoulettes.length} / {currentTier.features.maxRoulettes} roulettes created
              </p>
            </div>
            <button
              onClick={() => setShowSubscription(true)}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700"
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Create Roulette Button */}
        {userRoulettes.length < currentTier.features.maxRoulettes ? (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-8 flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Roulette
          </button>
        ) : (
          <div className="mb-8 flex items-center justify-center p-4 bg-white/10 rounded-lg text-white cursor-pointer hover:bg-white/20" onClick={() => setShowSubscription(true)}>
            <Lock className="w-5 h-5 mr-2" />
            Upgrade your plan to create more roulettes
          </div>
        )}

        {/* Roulettes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRoulettes.map((roulette) => (
            <div
              key={roulette.id}
              className="bg-white rounded-lg shadow-xl p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900">
                  {roulette.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingRoulette(roulette)}
                    className="p-2 text-gray-600 hover:text-purple-600"
                    title="Edit roulette"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => copyShareLink(roulette)}
                    className="p-2 text-gray-600 hover:text-purple-600"
                    title="Copy share link"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteRoulette(roulette.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Delete roulette"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Packages */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Packages:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(Array.isArray(roulette.packages) ? roulette.packages : []).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-2 bg-gray-50 rounded border border-gray-100"
                    >
                      <p className="font-medium text-gray-900">{pkg.name}</p>
                      <p className="text-sm text-gray-600">${pkg.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Codes */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Active Codes:</h4>
                <div className="space-y-1">
                  {(roulette.accessCodes || [])
                    .filter(code => !code.isUsed)
                    .map((code) => (
                      <div
                        key={code.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100"
                      >
                        <code className="text-sm font-mono text-purple-600">
                          {code.code}
                        </code>
                        <span className="text-sm text-gray-600">
                          {code.spinsLeft}/{code.totalSpins} spins
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;