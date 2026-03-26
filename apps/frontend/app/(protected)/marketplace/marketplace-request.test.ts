import { describe, expect, it } from 'vitest';

import { buildMarketplaceSectionEndpoint, createMarketplaceSectionQueryKey } from './marketplace-request';

const filters = {
  availability: 'all' as const,
  estimatedCpm: { max: 25, min: 8 },
  price: { max: null, min: 1500 },
  query: 'newsletter',
  sort: 'reach' as const,
  type: 'NEWSLETTER' as const,
  verifiedOnly: true,
};

describe('marketplace request helpers', () => {
  it('builds section endpoints without leaking the UI-only availability filter', () => {
    const endpoint = buildMarketplaceSectionEndpoint(filters, 'booked', {
      cursor: 'cursor-123',
      limit: 10,
    });

    expect(endpoint).toBe(
      '/api/ad-slots/marketplace?limit=10&segment=booked&q=newsletter&type=NEWSLETTER&verified=1&sort=reach&priceMin=1500&cpmMin=8&cpmMax=25&cursor=cursor-123'
    );
  });

  it('uses the endpoint token as the infinite-query cache key', () => {
    expect(createMarketplaceSectionQueryKey(filters, 'available')).toEqual([
      'marketplace',
      'section',
      '/api/ad-slots/marketplace?limit=10&segment=available&q=newsletter&type=NEWSLETTER&verified=1&sort=reach&priceMin=1500&cpmMin=8&cpmMax=25',
    ]);
  });
});
