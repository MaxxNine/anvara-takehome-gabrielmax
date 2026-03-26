import { describe, expect, it } from 'vitest';

import { parseMarketplaceAdSlotFilters } from './marketplace-query.js';

describe('parseMarketplaceAdSlotFilters', () => {
  it('applies defaults and publisher scoping for marketplace queries', () => {
    expect(parseMarketplaceAdSlotFilters({}, 'publisher-1')).toEqual({
      estimatedCpm: { max: null, min: null },
      limit: 10,
      price: { max: null, min: null },
      publisherId: 'publisher-1',
      segment: 'available',
      sort: 'price-desc',
      verifiedOnly: false,
    });
  });

  it('normalizes ranges, clamps limits, and parses typed filter values', () => {
    expect(
      parseMarketplaceAdSlotFilters({
        cpmMax: '10',
        cpmMin: '25',
        cursor: 'cursor-token',
        limit: '99',
        priceMax: '1500',
        priceMin: '3000',
        q: '  podcast  ',
        segment: 'booked',
        sort: 'reach',
        type: 'PODCAST',
        verified: 'true',
      })
    ).toEqual({
      cursor: 'cursor-token',
      estimatedCpm: { max: 25, min: 10 },
      limit: 30,
      price: { max: 3000, min: 1500 },
      query: 'podcast',
      segment: 'booked',
      sort: 'reach',
      type: 'PODCAST',
      verifiedOnly: true,
    });
  });
});
