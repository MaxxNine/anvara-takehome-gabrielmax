import type { AdSlot } from '@/lib/types';

import { describe, expect, it } from 'vitest';

import { defaultMarketplaceFilters } from './marketplace-filter.constants';
import {
  applyMarketplaceFilters,
  clampMarketplaceFilters,
  getActiveAdvancedFilterCount,
  getMarketplaceFilterBounds,
  hasActiveMarketplaceFilters,
  normalizeMarketplaceSlots,
} from './marketplace-filter.utils';

const adSlots: AdSlot[] = [
  {
    basePrice: 1500,
    description: 'Newsletter sponsorship',
    id: 'one',
    isAvailable: true,
    name: 'Morning Brief',
    publisher: {
      id: 'publisher-1',
      isVerified: true,
      monthlyViews: 10_000,
      name: 'Daily Planet',
      subscriberCount: 25_000,
    },
    publisherId: 'publisher-1',
    type: 'NEWSLETTER',
  },
  {
    basePrice: 5200,
    description: 'Homepage takeover',
    id: 'two',
    isAvailable: false,
    name: 'Premium Display',
    publisher: {
      id: 'publisher-2',
      isVerified: false,
      monthlyViews: 200_000,
      name: 'Tech Post',
      subscriberCount: 0,
    },
    publisherId: 'publisher-2',
    type: 'DISPLAY',
  },
  {
    basePrice: 3200,
    description: 'Video pre-roll placement',
    id: 'three',
    isAvailable: true,
    name: 'Creator Stream',
    publisher: {
      id: 'publisher-3',
      isVerified: true,
      monthlyViews: 120_000,
      name: 'Video Weekly',
      subscriberCount: 0,
    },
    publisherId: 'publisher-3',
    type: 'VIDEO',
  },
];

describe('marketplace filter utils', () => {
  it('derives price and CPM bounds from normalized slots', () => {
    const bounds = getMarketplaceFilterBounds(normalizeMarketplaceSlots(adSlots));

    expect(bounds.price).toEqual({
      hasData: true,
      max: 5200,
      min: 1500,
    });
    expect(bounds.estimatedCpm.hasData).toBe(true);
  });

  it('clamps invalid ranges to valid dataset bounds', () => {
    const normalized = normalizeMarketplaceSlots(adSlots);
    const bounds = getMarketplaceFilterBounds(normalized);

    expect(
      clampMarketplaceFilters(
        {
          ...defaultMarketplaceFilters,
          estimatedCpm: {
            max: 9999,
            min: -100,
          },
          price: {
            max: 999999,
            min: 10,
          },
        },
        bounds
      )
    ).toEqual(defaultMarketplaceFilters);
  });

  it('filters, sorts, and counts missing CPM values correctly', () => {
    const normalized = normalizeMarketplaceSlots([
      ...adSlots,
      {
        basePrice: 1000,
        description: 'No audience data',
        id: 'four',
        isAvailable: true,
        name: 'Unknown Reach',
        publisher: {
          id: 'publisher-4',
          isVerified: true,
          name: 'Mystery Media',
        },
        publisherId: 'publisher-4',
        type: 'DISPLAY',
      },
    ]);

    const result = applyMarketplaceFilters(normalized, {
      ...defaultMarketplaceFilters,
      availability: 'all',
      estimatedCpm: {
        max: 30,
        min: 5,
      },
      verifiedOnly: true,
    });

    expect(result.filtered.map((slot) => slot.id)).toEqual(['one', 'three']);
    expect(result.available.map((slot) => slot.id)).toEqual(['three', 'one']);
    expect(result.booked).toEqual([]);
    expect(result.missingEstimatedCpmCount).toBe(1);
  });

  it('tracks active filter count and active-state correctly', () => {
    const filters = {
      ...defaultMarketplaceFilters,
      price: {
        max: 4000,
        min: null,
      },
      query: 'display',
      verifiedOnly: true,
    };

    expect(getActiveAdvancedFilterCount(filters)).toBe(2);
    expect(hasActiveMarketplaceFilters(filters)).toBe(true);
  });
});
