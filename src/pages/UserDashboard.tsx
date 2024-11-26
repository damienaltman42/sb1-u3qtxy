import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gift, Search } from 'lucide-react';
import type { UserWin } from '../types';
import { wins } from '../lib/api';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userWins, setUserWins] = useState<UserWin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWins();
  }, [user, navigate]);

  const loadWins = async () => {
    try {
      const data = await wins.getUserWins();
      setUserWins(data);
    } catch (error) {
      console.error('Error loading wins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWins = userWins.filter(win => 
    win.prize.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    win.rouletteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    win.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Prizes</h1>
          <p className="text-gray-300 mt-2">Track all your wins and prizes</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prizes..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* Wins Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-300">Loading prizes...</p>
        </div>
      ) : filteredWins.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Prizes Yet</h3>
          <p className="text-gray-400">Start playing to win amazing prizes!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWins.map((win) => (
            <div
              key={win.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{win.prize.text}</h3>
                  <p className="text-gray-400 text-sm">
                    Won from {win.rouletteName} by {win.creatorName}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: win.prize.color }}
                >
                  {win.claimed ? 'Claimed' : 'Unclaimed'}
                </span>
              </div>

              <div className="text-sm text-gray-400">
                Won on {new Date(win.createdAt).toLocaleDateString()}
              </div>

              {!win.claimed && (
                <button
                  onClick={() => navigate(`/roulette/${win.rouletteId}`)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors"
                >
                  Claim Prize
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;