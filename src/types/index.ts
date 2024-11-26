import { LucideIcon } from 'lucide-react';

export interface RouletteItem {
  id: string;
  text: string;
  color: string;
  probability: number;
}

export interface PricePackage {
  id: string;
  name: string;
  price: number;
  spins: number;
  description?: string;
  isPopular?: boolean;
}

export interface AccessCode {
  id: string;
  code: string;
  spinsLeft: number;
  totalSpins: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface RouletteConfig {
  id: string;
  creator_id: string; // Updated to snake_case
  name: string;
  title?: string;
  description?: string;
  items: RouletteItem[];
  packages: PricePackage[];
  accessCodes: AccessCode[];
  creator?: {
    username: string;
    avatar?: string;
    socialLink?: string;
  };
  likes: number;
  created_at: string; // Updated to snake_case
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  socialLink?: string;
  description?: string;
  socialLinks?: SocialLink[];
  role: UserRole;
}

export type UserRole = 'creator' | 'user';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: LucideIcon;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  isPopular?: boolean;
  features: {
    maxSpinsPerMonth: number;
    maxPackagesPerRoulette: number;
    maxRoulettes: number;
    customBranding: boolean;
    analytics: boolean;
    priority: boolean;
  };
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  socialLink?: string;
  avatar?: string;
  description?: string;
  socialLinks?: SocialLink[];
}

export interface UserWin {
  id: string;
  user_id: string; // Updated to snake_case
  roulette_id: string; // Updated to snake_case
  rouletteName: string;
  creatorName: string;
  prize: RouletteItem;
  claimed: boolean;
  created_at: string; // Updated to snake_case
}

export interface RouletteProps {
  items: RouletteItem[];
  onSpinComplete: (item: RouletteItem) => void;
  isSpinning: boolean;
  onSpin: () => void;
  disabled?: boolean;
}

export interface CodeInputProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error?: string;
}