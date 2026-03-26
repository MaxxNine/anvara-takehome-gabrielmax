import { describe, expect, it } from 'vitest';

import type { MarketplaceAdSlotFilters } from '../../types/index.js';
import {
  applyMarketplaceDerivedFilters,
  buildMarketplaceCatalogMeta,
  type MarketplaceAdSlotRecord,
  type MarketplaceCatalogRecord,
} from './ad-slot.marketplace-helpers.js';
import { decodeMarketplaceCursor, paginateMarketplaceItems } from './ad-slot.marketplace-pagination.js';

const decimalValue = (value: number) =>
  value as unknown as MarketplaceAdSlotRecord['basePrice'];

function createCatalogRecord(
  overrides: Partial<MarketplaceCatalogRecord> = {}
): MarketplaceCatalogRecord {
  return {
    basePrice: decimalValue(1000) as MarketplaceCatalogRecord['basePrice'],
    id: 'slot-1',
    isAvailable: true,
    publisher: {
      monthlyViews: 100_000,
      subscriberCount: 10_000,
    },
    type: 'DISPLAY',
    ...overrides,
  };
}

function createAdSlotRecord(
  overrides: Partial<MarketplaceAdSlotRecord> = {}
): MarketplaceAdSlotRecord {
  return {
    basePrice: decimalValue(1000),
    cpmFloor: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    description: null,
    height: null,
    id: 'slot-1',
    isAvailable: true,
    name: 'Homepage Hero',
    position: null,
    publisher: {
      category: 'Media',
      id: 'publisher-1',
      isVerified: true,
      monthlyViews: 100_000,
      name: 'Daily Planet',
      subscriberCount: 10_000,
    },
    publisherId: 'publisher-1',
    type: 'DISPLAY',
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    width: null,
    ...overrides,
  };
}

const baseFilters: MarketplaceAdSlotFilters = {
  estimatedCpm: { max: null, min: null },
  limit: 10,
  price: { max: null, min: null },
  segment: 'available',
  sort: 'price-desc',
  verifiedOnly: false,
};

describe('marketplace ad-slot helpers', () => {
  it('derives catalog counts and bounds from the visible marketplace scope', () => {
    const meta = buildMarketplaceCatalogMeta([
      createCatalogRecord(),
      createCatalogRecord({
        basePrice: decimalValue(2400) as MarketplaceCatalogRecord['basePrice'],
        id: 'slot-2',
        isAvailable: false,
        publisher: { monthlyViews: 50_000, subscriberCount: 20_000 },
        type: 'NEWSLETTER',
      }),
    ]);

    expect(meta).toEqual({
      availableSlots: 1,
      bounds: {
        estimatedCpm: { hasData: true, max: 120, min: 10 },
        price: { hasData: true, max: 2400, min: 1000 },
      },
      totalSlots: 2,
    });
  });

  it('applies CPM filtering, excludes unknown CPM values, and sorts remaining slots', () => {
    const filtered = applyMarketplaceDerivedFilters(
      [
        createAdSlotRecord({ basePrice: decimalValue(1800), id: 'slot-a' }),
        createAdSlotRecord({
          basePrice: decimalValue(3200),
          id: 'slot-b',
          publisher: { category: 'Media', id: 'publisher-2', isVerified: true, monthlyViews: 20_000, name: 'North Star', subscriberCount: 0 },
        }),
        createAdSlotRecord({
          basePrice: decimalValue(1200),
          id: 'slot-c',
          publisher: { category: 'Media', id: 'publisher-3', isVerified: false, monthlyViews: 0, name: 'No Metrics', subscriberCount: 0 },
        }),
      ],
      {
        ...baseFilters,
        estimatedCpm: { max: 90, min: 10 },
        sort: 'reach',
      }
    );

    expect(filtered.missingEstimatedCpmCount).toBe(1);
    expect(filtered.items.map((item) => item.id)).toEqual(['slot-a']);
  });

  it('paginates with a cursor derived from the last loaded item', () => {
    const firstPage = paginateMarketplaceItems(
      [{ id: 'slot-a' }, { id: 'slot-b' }, { id: 'slot-c' }],
      2
    );
    const secondPage = paginateMarketplaceItems(
      [{ id: 'slot-a' }, { id: 'slot-b' }, { id: 'slot-c' }],
      2,
      firstPage.pageInfo.nextCursor ?? undefined
    );

    expect(decodeMarketplaceCursor(firstPage.pageInfo.nextCursor!)).toBe('slot-b');
    expect(firstPage.items.map((item) => item.id)).toEqual(['slot-a', 'slot-b']);
    expect(secondPage.items.map((item) => item.id)).toEqual(['slot-c']);
    expect(secondPage.pageInfo.hasNextPage).toBe(false);
  });
});
