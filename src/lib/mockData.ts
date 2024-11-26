import { v4 as uuidv4 } from 'uuid';
import type { RouletteConfig, SignUpData, PricePackage, AccessCode, User, UserWin } from '../types';
import { PRESET_COLORS } from './constants/colors';

// Mock users data
let users: User[] = [
  {
    id: '1',
    username: 'Test Creator',
    email: 'test@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    socialLink: 'https://onlyfans.com/test-creator',
    role: 'creator'
  }
];

// Sample packages
const samplePackages: PricePackage[] = [
  {
    id: '1',
    name: 'Single Spin',
    price: 5,
    spins: 1,
    description: 'Try your luck once!'
  },
  {
    id: '2',
    name: 'Triple Fun',
    price: 12,
    spins: 3,
    description: 'More chances to win!',
    isPopular: true
  }
];

// Sample access codes
const sampleCodes: AccessCode[] = [
  {
    id: '1',
    code: 'DEMO123',
    spinsLeft: 3,
    totalSpins: 3,
    isUsed: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock roulettes data
let roulettes: RouletteConfig[] = [
  {
    id: '1',
    creatorId: '1',
    name: 'Demo Roulette',
    title: 'My First Roulette',
    description: 'Try your luck with these amazing prizes!',
    items: [
      { id: '1', text: 'Special Photo', color: PRESET_COLORS[0], probability: 0.2 },
      { id: '2', text: 'Custom Video', color: PRESET_COLORS[1], probability: 0.2 },
      { id: '3', text: 'Private Chat', color: PRESET_COLORS[2], probability: 0.2 }
    ],
    packages: samplePackages,
    accessCodes: sampleCodes,
    creator: {
      username: 'Test Creator',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      socialLink: 'https://onlyfans.com/test-creator'
    },
    likes: 0,
    created_at: new Date().toISOString()
  }
];

// Mock wins data
let wins: UserWin[] = [
  {
    id: '1',
    userId: '1',
    rouletteId: '1',
    rouletteName: 'Demo Roulette',
    creatorName: 'Test Creator',
    prize: {
      id: '1',
      text: 'Special Photo',
      color: PRESET_COLORS[0],
      probability: 0.2
    },
    claimed: false,
    createdAt: new Date().toISOString()
  }
];

// Mock likes data
let likes: { userId: string; rouletteId: string }[] = [];

export const mockDb = {
  users: {
    findByEmail: (email: string) => users.find(u => u.email === email),
    create: (userData: SignUpData) => {
      const newUser = { ...userData, id: uuidv4() };
      users.push(newUser as User);
      return newUser;
    },
    update: (data: Partial<User>) => {
      const index = users.findIndex(u => u.id === '1'); // Mock current user
      if (index === -1) throw new Error('User not found');
      
      users[index] = {
        ...users[index],
        ...data
      };
      
      return users[index];
    }
  },
  roulettes: {
    create: (data: Partial<RouletteConfig>) => {
      const newRoulette: RouletteConfig = {
        id: uuidv4(),
        creatorId: data.creatorId!,
        name: data.name!,
        title: data.title || data.name!,
        description: data.description,
        items: data.items!,
        packages: data.packages || [],
        accessCodes: data.accessCodes || [],
        creator: users.find(u => u.id === data.creatorId),
        likes: 0,
        created_at: new Date().toISOString()
      };
      roulettes.push(newRoulette);
      return newRoulette;
    },
    findAll: () => roulettes,
    findByCreator: (creatorId: string) => 
      roulettes.filter(r => r.creatorId === creatorId),
    findById: (id: string) => 
      roulettes.find(r => r.id === id),
    delete: (id: string) => {
      roulettes = roulettes.filter(r => r.id !== id);
      return { id };
    },
    update: (id: string, data: Partial<RouletteConfig>) => {
      const index = roulettes.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Roulette not found');
      
      roulettes[index] = {
        ...roulettes[index],
        ...data
      };
      
      return roulettes[index];
    }
  },
  wins: {
    findByUser: (userId: string) => wins.filter(w => w.userId === userId),
    update: (id: string, data: Partial<UserWin>) => {
      const index = wins.findIndex(w => w.id === id);
      if (index === -1) throw new Error('Win not found');
      
      wins[index] = {
        ...wins[index],
        ...data
      };
      
      return wins[index];
    }
  },
  likes: {
    add: (rouletteId: string) => {
      const userId = '1'; // Mock user ID
      const existingLike = likes.find(l => l.userId === userId && l.rouletteId === rouletteId);
      
      if (!existingLike) {
        likes.push({ userId, rouletteId });
        const roulette = roulettes.find(r => r.id === rouletteId);
        if (roulette) {
          roulette.likes = (roulette.likes || 0) + 1;
        }
      }
      
      return { liked: true };
    },
    remove: (rouletteId: string) => {
      const userId = '1'; // Mock user ID
      likes = likes.filter(l => !(l.userId === userId && l.rouletteId === rouletteId));
      
      const roulette = roulettes.find(r => r.id === rouletteId);
      if (roulette && roulette.likes > 0) {
        roulette.likes--;
      }
      
      return { liked: false };
    },
    findByUser: (userId: string) => 
      likes.filter(l => l.userId === userId).map(l => l.rouletteId)
  }
};