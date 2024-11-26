import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Star } from 'lucide-react';
import { roulettes } from '../lib/api';
import type { RouletteConfig } from '../types';
import RouletteLikeButton from '../components/RouletteLikeButton';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [allRoulettes, setAllRoulettes] = useState<RouletteConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRoulettes();
  }, []);

  const loadRoulettes = async () => {
    try {
      const data = await roulettes.getAllPublic();
      // Parse packages JSON if it's a string
      const processedData = data.map((roulette: RouletteConfig) => ({
        ...roulette,
        packages: typeof roulette.packages === 'string' ? JSON.parse(roulette.packages) : roulette.packages,
        items: typeof roulette.items === 'string' ? JSON.parse(roulette.items) : roulette.items
      }));
      setAllRoulettes(processedData);
    } catch (error) {
      console.error('Error loading roulettes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoulettes = allRoulettes.filter(roulette => 
    roulette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roulette.creator?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to OnlyFans Roulette
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover exclusive content and win amazing prizes from your favorite creators
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roulettes or creators..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Roulettes Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-300">Loading roulettes...</p>
        </div>
      ) : filteredRoulettes.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Roulettes Found</h3>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoulettes.map((roulette) => (
            <div
              key={roulette.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => navigate(`/roulette/${roulette.id}`)}
            >
              {/* Creator Info */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={roulette.creator?.avatar}
                    alt={roulette.creator?.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {roulette.name}
                    </h3>
                    <p className="text-gray-400">
                      by {roulette.creator?.username}
                    </p>
                  </div>
                </div>

                {/* Roulette Details */}
                <p className="text-gray-300 mb-4 line-clamp-2">
                  {roulette.description || 'Spin to win exclusive content!'}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <RouletteLikeButton
                    rouletteId={roulette.id}
                    initialLikes={roulette.likes}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />

                  {Array.isArray(roulette.packages) && roulette.packages.some(pkg => pkg.isPopular) && (
                    <span className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Popular
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;