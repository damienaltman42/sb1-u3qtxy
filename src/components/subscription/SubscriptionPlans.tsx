import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../../lib/constants/subscriptionTiers';
import type { SubscriptionTier } from '../../types';

interface SubscriptionPlansProps {
  currentTier: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ currentTier, onSelect }) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const discount = 0.2; // 20% discount for yearly billing

  const getPrice = (price: number) => {
    if (billingPeriod === 'yearly') {
      const monthlyPrice = price * (1 - discount);
      return Math.round(monthlyPrice * 12 * 100) / 100;
    }
    return price;
  };

  return (
    <div className="space-y-8">
      {/* Billing Period Toggle */}
      <div className="flex justify-center">
        <div className="bg-purple-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingPeriod === 'monthly'
                ? 'bg-white text-purple-600 shadow'
                : 'text-purple-600'
            }`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingPeriod === 'yearly'
                ? 'bg-white text-purple-600 shadow'
                : 'text-purple-600'
            }`}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly ({discount * 100}% off)
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrentTier = currentTier.id === tier.id;
          const price = getPrice(tier.price);

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl ${
                tier.isPopular
                  ? 'border-2 border-purple-500 shadow-purple-100'
                  : 'border border-gray-200'
              } bg-white shadow-xl p-6`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {tier.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-gray-500">
                    /{billingPeriod === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>

                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{tier.features.maxSpinsPerMonth === Infinity ? 'Unlimited' : tier.features.maxSpinsPerMonth} spins per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>Up to {tier.features.maxRoulettes} roulettes</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{tier.features.maxPackagesPerRoulette === Infinity ? 'Unlimited' : tier.features.maxPackagesPerRoulette} packages per roulette</span>
                  </li>
                  {tier.features.customBranding && (
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Custom branding</span>
                    </li>
                  )}
                  {tier.features.analytics && (
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Analytics dashboard</span>
                    </li>
                  )}
                  {tier.features.priority && (
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Priority support</span>
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => onSelect(tier)}
                  disabled={isCurrentTier}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    isCurrentTier
                      ? 'bg-purple-100 text-purple-600 cursor-default'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                  }`}
                >
                  {isCurrentTier ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-500">
        All plans include 24/7 support and a 30-day money-back guarantee
      </p>
    </div>
  );
};

export default SubscriptionPlans;