import type { SubscriptionTier } from '../../types';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      maxSpinsPerMonth: 20,
      maxPackagesPerRoulette: 1,
      maxRoulettes: 1,
      customBranding: false,
      analytics: false,
      priority: false
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    features: {
      maxSpinsPerMonth: 100,
      maxPackagesPerRoulette: 3,
      maxRoulettes: 3,
      customBranding: false,
      analytics: true,
      priority: false
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 24.99,
    isPopular: true,
    features: {
      maxSpinsPerMonth: 500,
      maxPackagesPerRoulette: 10,
      maxRoulettes: 10,
      customBranding: true,
      analytics: true,
      priority: false
    }
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 49.99,
    features: {
      maxSpinsPerMonth: Infinity,
      maxPackagesPerRoulette: Infinity,
      maxRoulettes: Infinity,
      customBranding: true,
      analytics: true,
      priority: true
    }
  }
];