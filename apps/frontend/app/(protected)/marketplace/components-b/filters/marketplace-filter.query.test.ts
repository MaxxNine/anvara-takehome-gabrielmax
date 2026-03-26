import { describe, expect, it } from 'vitest';

import { defaultMarketplaceFilters } from './marketplace-filter.constants';
import { parseMarketplaceFiltersFromSearchParams, serializeMarketplaceFiltersToSearchParams } from './marketplace-filter.query';

describe('parseMarketplaceFiltersFromSearchParams', () => {
  it('falls back to defaults for invalid values', () => {
    expect(
      parseMarketplaceFiltersFromSearchParams({
        availability: 'invalid',
        sort: 'wrong',
        type: 'NOT_REAL',
        verified: 'nope',
      })
    ).toEqual(defaultMarketplaceFilters);
  });

  it('parses valid marketplace filters', () => {
    expect(
      parseMarketplaceFiltersFromSearchParams({
        availability: 'all',
        cpmMax: '42',
        cpmMin: '12',
        priceMax: '4500',
        priceMin: '1000',
        q: 'podcast',
        sort: 'reach',
        type: 'PODCAST',
        verified: '1',
      })
    ).toEqual({
      availability: 'all',
      estimatedCpm: {
        max: 42,
        min: 12,
      },
      price: {
        max: 4500,
        min: 1000,
      },
      query: 'podcast',
      sort: 'reach',
      type: 'PODCAST',
      verifiedOnly: true,
    });
  });
});

describe('serializeMarketplaceFiltersToSearchParams', () => {
  it('preserves unrelated params while replacing marketplace params', () => {
    const search = serializeMarketplaceFiltersToSearchParams('?ab=marketplace-layout:B&q=old', {
      availability: 'all',
      estimatedCpm: {
        max: null,
        min: 20,
      },
      price: {
        max: 5000,
        min: null,
      },
      query: 'video',
      sort: 'reach',
      type: 'VIDEO',
      verifiedOnly: true,
    });

    expect(search).toBe(
      'ab=marketplace-layout%3AB&q=video&type=VIDEO&availability=all&verified=1&sort=reach&priceMax=5000&cpmMin=20'
    );
  });

  it('omits default values from the query string', () => {
    expect(
      serializeMarketplaceFiltersToSearchParams('?ab=marketplace-layout:B', defaultMarketplaceFilters)
    ).toBe('ab=marketplace-layout%3AB');
  });
});
