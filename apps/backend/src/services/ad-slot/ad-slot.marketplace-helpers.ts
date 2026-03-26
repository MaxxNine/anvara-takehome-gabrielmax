import type { Prisma } from '../../generated/prisma/client.js';
import {
  type MarketplaceAdSlotFilters,
  type MarketplaceCatalogMeta,
  type MarketplaceNumericRange,
} from '../../types/index.js';

export const marketplaceAdSlotInclude = {
  publisher: {
    select: {
      category: true,
      id: true,
      isVerified: true,
      monthlyViews: true,
      name: true,
      subscriberCount: true,
    },
  },
} satisfies Prisma.AdSlotInclude;

export const marketplaceCatalogSelect = {
  basePrice: true,
  id: true,
  isAvailable: true,
  publisher: {
    select: {
      monthlyViews: true,
      subscriberCount: true,
    },
  },
  type: true,
} satisfies Prisma.AdSlotSelect;

export type MarketplaceAdSlotRecord = Prisma.AdSlotGetPayload<{
  include: typeof marketplaceAdSlotInclude;
}>;
export type MarketplaceCatalogRecord = Prisma.AdSlotGetPayload<{
  select: typeof marketplaceCatalogSelect;
}>;

function createBounds(values: number[]) {
  if (values.length === 0) {
    return { hasData: false, max: 0, min: 0 };
  }

  return {
    hasData: true,
    max: Math.ceil(Math.max(...values)),
    min: Math.floor(Math.min(...values)),
  };
}

function getAudienceSize(slot: Pick<MarketplaceCatalogRecord, 'publisher' | 'type'>): number | null {
  if (slot.type === 'NEWSLETTER') {
    return slot.publisher?.subscriberCount ?? slot.publisher?.monthlyViews ?? null;
  }

  return slot.publisher?.monthlyViews ?? slot.publisher?.subscriberCount ?? null;
}

function getEstimatedCpmValue(price: number, audienceSize: number | null): number | null {
  if (!audienceSize || audienceSize <= 0) {
    return null;
  }

  return price / audienceSize * 1000;
}

function matchesRange(value: number, range: MarketplaceNumericRange): boolean {
  if (range.min !== null && value < range.min) return false;
  if (range.max !== null && value > range.max) return false;
  return true;
}

function hasActiveRange(range: MarketplaceNumericRange): boolean {
  return range.min !== null || range.max !== null;
}

function compareById(leftId: string, rightId: string): number {
  return leftId.localeCompare(rightId);
}

export function buildMarketplaceCatalogMeta(records: MarketplaceCatalogRecord[]): MarketplaceCatalogMeta {
  const estimatedCpmValues: number[] = [];
  const priceValues: number[] = [];
  let availableSlots = 0;

  for (const record of records) {
    const price = Number(record.basePrice);
    const estimatedCpm = getEstimatedCpmValue(price, getAudienceSize(record));

    priceValues.push(price);
    if (estimatedCpm !== null) estimatedCpmValues.push(estimatedCpm);
    if (record.isAvailable) availableSlots += 1;
  }

  return {
    availableSlots,
    bounds: {
      estimatedCpm: createBounds(estimatedCpmValues),
      price: createBounds(priceValues),
    },
    totalSlots: records.length,
  };
}

export function applyMarketplaceDerivedFilters(
  records: MarketplaceAdSlotRecord[],
  filters: MarketplaceAdSlotFilters
) {
  let missingEstimatedCpmCount = 0;
  let filtered = records;

  if (hasActiveRange(filters.estimatedCpm)) {
    missingEstimatedCpmCount = filtered.filter(
      (record) => getEstimatedCpmValue(Number(record.basePrice), getAudienceSize(record)) === null
    ).length;
    filtered = filtered.filter((record) => {
      const estimatedCpm = getEstimatedCpmValue(Number(record.basePrice), getAudienceSize(record));
      return estimatedCpm !== null && matchesRange(estimatedCpm, filters.estimatedCpm);
    });
  }

  const sorted = [...filtered].sort((left, right) => {
    const leftPrice = Number(left.basePrice);
    const rightPrice = Number(right.basePrice);

    if (filters.sort === 'price-asc') {
      return leftPrice - rightPrice || compareById(left.id, right.id);
    }

    if (filters.sort === 'reach') {
      const leftReach = getAudienceSize(left) ?? 0;
      const rightReach = getAudienceSize(right) ?? 0;
      return rightReach - leftReach || rightPrice - leftPrice || compareById(left.id, right.id);
    }

    return rightPrice - leftPrice || compareById(left.id, right.id);
  });

  return { items: sorted, missingEstimatedCpmCount };
}
