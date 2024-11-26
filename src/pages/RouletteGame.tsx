import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, ExternalLink } from 'lucide-react';
import { roulettes, codes, wins } from '../lib/api';
import type { RouletteConfig, RouletteItem } from '../types';
import Roulette from '../components/Roulette';
import CodeInput from '../components/CodeInput';
import RouletteLikeButton from '../components/RouletteLikeButton';

const RouletteGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [roulette, setRoulette] = useState<RouletteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [currentCode, setCurrentCode] = useState('');
  const [winner, setWinner] = useState<RouletteItem | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoulette();
    }
  }, [id]);

  const loadRoulette = async () => {
    if (!id) return;

    try {
      const data = await roulettes.getOne(id);
      // Parse JSON strings if needed
      const processedData = {
        ...data,
        packages: typeof data.packages === 'string' ? JSON.parse(data.packages) : data.packages,
        items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items
      };
      setRoulette(processedData);
    } catch (error) {
      console.error('Error loading roulette:', error);
      setError('Failed to load roulette');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    if (!id) return;
    setVerifyingCode(true);
    setError('');

    try {
      const response = await codes.verify(id, code);
      setSpinsLeft(response.spinsLeft);
      setCurrentCode(code);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinComplete = async (item: RouletteItem) => {
    setIsSpinning(false);
    setWinner(item);
    setSpinsLeft(prev => prev - 1);

    if (!user || !id) return;

    try {
      await wins.create(id, item);
    } catch (error) {
      console.error('Error recording win:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading roulette...</p>
      </div>
    );
  }

  if (!roulette) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Roulette Not Found</h2>
          <p className="text-gray-400 mb-4">This roulette might have been removed</p>
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const packages = Array.isArray(roulette.packages) ? roulette.packages : [];
  const items = Array.isArray(roulette.items) ? roulette.items : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Creator Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={roulette.creator?.avatar}
            alt={roulette.creator?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{roulette.name}</h1>
            <div className="flex items-center space-x-2 text-gray-400">
              <User className="w-4 h-4" />
              <span>{roulette.creator?.username}</span>
              {roulette.creator?.socialLink && (
                <a
                  href={roulette.creator.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-purple-400"
                >
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>

        <RouletteLikeButton
          rouletteId={roulette.id}
          initialLikes={roulette.likes}
        />
      </div>

      {/* Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roulette Wheel */}
        <div className="lg:col-span-2">
          <Roulette
            items={items}
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            onSpin={handleSpin}
            disabled={spinsLeft <= 0}
          />

          {winner && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h3>
              <p className="text-xl text-purple-400">You won: {winner.text}</p>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Spins Counter */}
          {spinsLeft > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Spins Left</h3>
              <p className="text-3xl font-bold text-purple-400">{spinsLeft}</p>
            </div>
          )}

          {/* Access Code Input */}
          {spinsLeft <= 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Enter Access Code</h3>
              <CodeInput
                onSubmit={handleCodeSubmit}
                isLoading={verifyingCode}
                error={error}
              />
            </div>
          )}

          {/* Packages */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Get More Spins</h3>
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative p-4 rounded-lg border ${
                    pkg.isPopular
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3 right-4 px-2 py-1 text-xs font-semibold bg-purple-500 text-white rounded-full">
                      Popular
                    </span>
                  )}
                  <h4 className="text-lg font-semibold text-white">
                    {pkg.name}
                  </h4>
                  {pkg.description && (
                    <p className="text-sm text-gray-400 mb-2">{pkg.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400">{pkg.spins} spins</span>
                    <span className="text-white font-semibold">${pkg.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteGame;