import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { likes } from '../lib/api';

interface RouletteLikeButtonProps {
  rouletteId: string;
  initialLikes: number;
  initialLiked?: boolean;
}

const RouletteLikeButton: React.FC<RouletteLikeButtonProps> = ({
  rouletteId,
  initialLikes,
  initialLiked = false
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isLiked) {
        await likes.unlike(rouletteId);
        setLikesCount(prev => prev - 1);
      } else {
        await likes.like(rouletteId);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isLoading}
      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors ${
        isLiked
          ? 'text-pink-500 bg-pink-500/10'
          : 'text-gray-400 hover:text-pink-500 bg-white/5 hover:bg-pink-500/10'
      }`}
    >
      <Heart
        className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${
          isLoading ? 'animate-pulse' : ''
        }`}
      />
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
};

export default RouletteLikeButton;