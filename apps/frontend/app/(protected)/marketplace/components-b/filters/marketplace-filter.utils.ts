import type { AdSlot } from '@/lib/types';

import { getAudienceSize, getEstimatedCpmValue } from '../format-helpers';
import { defaultMarketplaceFilters } from './marketplace-filter.constants';
import type {
  MarketplaceFilterBounds,
  MarketplaceFilterResults,
  MarketplaceFilters,
  MarketplaceSortOption,
  NormalizedMarketplaceSlot,
  NumericRange,
  NumericRangeBounds,
} from './marketplace-filter.types';

function clampNumber(value: number, bounds: NumericRangeBounds): number {
  return Math.min(Math.max(value, bounds.min), bounds.max);
}

function hasActiveRange(range: NumericRange): boolean {
  return range.min !== null || range.max !== null;
}

function clampRange(range: NumericRange, bounds: NumericRangeBounds): NumericRange {
  if (!bounds.hasData) {
    return {
      max: null,
      min: null,
    };
  }

  let min = Number.isFinite(range.min) ? clampNumber(range.min as number, bounds) : null;
  let max = Number.isFinite(range.max) ? clampNumber(range.max as number, bounds) : null;

  if (min !== null && min <= bounds.min) {
    min = null;
  }

  if (max !== null && max >= bounds.max) {
    max = null;
  }

  if (min !== null && max !== null && min > max) {
    [min, max] = [max, min];
  }

  return {
    max,
    min,
  };
}

function createBounds(values: number[]): NumericRangeBounds {
  if (values.length === 0) {
    return {
      hasData: false,
      max: 0,
      min: 0,
    };
  }

  return {
    hasData: true,
    max: Math.ceil(Math.max(...values)),
    min: Math.floor(Math.min(...values)),
  };
}

function matchesRange(value: number, range: NumericRange): boolean {
  if (range.min !== null && value < range.min) {
    return false;
  }

  if (range.max !== null && value > range.max) {
    return false;
  }

  return true;
}

function sortSlots(
  slots: NormalizedMarketplaceSlot[],
  sort: MarketplaceSortOption
): NormalizedMarketplaceSlot[] {
  const sorted = [...slots];

  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      return sorted;
    case 'reach':
      sorted.sort((a, b) => b.reach - a.reach || b.price - a.price);
      return sorted;
    case 'price-desc':
    default:
      sorted.sort((a, b) => b.price - a.price);
      return sorted;
  }
}

export function normalizeMarketplaceSlots(adSlots: AdSlot[]): NormalizedMarketplaceSlot[] {
  return adSlots.map((slot) => {
    const price = Number(slot.basePrice);
    const audienceSize = getAudienceSize(slot);
    const estimatedCpm = getEstimatedCpmValue(price, audienceSize);
    const searchIndex = [slot.name, slot.description, slot.publisher?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return {
      audienceSize,
      estimatedCpm,
      isVerified: Boolean(slot.publisher?.isVerified),
      price,
      reach: audienceSize ?? 0,
      searchIndex,
      slot,
    };
  });
}

export function getMarketplaceFilterBounds(
  slots: NormalizedMarketplaceSlot[]
): MarketplaceFilterBounds {
  return {
    estimatedCpm: createBounds(
      slots
        .map((slot) => slot.estimatedCpm)
        .filter((value): value is number => value !== null && Number.isFinite(value))
    ),
    price: createBounds(
      slots
        .map((slot) => slot.price)
        .filter((value): value is number => Number.isFinite(value))
    ),
  };
}

export function clampMarketplaceFilters(
  filters: MarketplaceFilters,
  bounds: MarketplaceFilterBounds
): MarketplaceFilters {
  return {
    ...filters,
    availability:
      filters.availability === 'all' ? 'all' : defaultMarketplaceFilters.availability,
    estimatedCpm: clampRange(filters.estimatedCpm, bounds.estimatedCpm),
    price: clampRange(filters.price, bounds.price),
    query: filters.query.trimStart(),
    sort: filters.sort,
    type: filters.type,
    verifiedOnly: filters.verifiedOnly,
  };
}

export function getActiveAdvancedFilterCount(filters: MarketplaceFilters): number {
  return (
    Number(filters.type !== defaultMarketplaceFilters.type) +
    Number(filters.availability !== defaultMarketplaceFilters.availability) +
    Number(filters.verifiedOnly !== defaultMarketplaceFilters.verifiedOnly) +
    Number(hasActiveRange(filters.price)) +
    Number(hasActiveRange(filters.estimatedCpm))
  );
}

export function hasActiveMarketplaceFilters(filters: MarketplaceFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.type !== defaultMarketplaceFilters.type ||
    filters.availability !== defaultMarketplaceFilters.availability ||
    filters.verifiedOnly !== defaultMarketplaceFilters.verifiedOnly ||
    hasActiveRange(filters.price) ||
    hasActiveRange(filters.estimatedCpm) ||
    filters.sort !== defaultMarketplaceFilters.sort
  );
}

export function applyMarketplaceFilters(
  slots: NormalizedMarketplaceSlot[],
  filters: MarketplaceFilters
): MarketplaceFilterResults {
  const query = filters.query.trim().toLowerCase();

  let filtered = slots.filter((slot) => {
    if (filters.availability === 'available' && !slot.slot.isAvailable) {
      return false;
    }

    if (filters.type !== 'ALL' && slot.slot.type !== filters.type) {
      return false;
    }

    if (filters.verifiedOnly && !slot.isVerified) {
      return false;
    }

    if (!matchesRange(slot.price, filters.price)) {
      return false;
    }

    if (query && !slot.searchIndex.includes(query)) {
      return false;
    }

    return true;
  });

  let missingEstimatedCpmCount = 0;

  if (hasActiveRange(filters.estimatedCpm)) {
    missingEstimatedCpmCount = filtered.filter((slot) => slot.estimatedCpm === null).length;
    filtered = filtered.filter(
      (slot) =>
        slot.estimatedCpm !== null && matchesRange(slot.estimatedCpm, filters.estimatedCpm)
    );
  }

  const sorted = sortSlots(filtered, filters.sort);
  const available = sorted
    .filter((slot) => slot.slot.isAvailable)
    .map((slot) => slot.slot);
  const booked = sorted
    .filter((slot) => !slot.slot.isAvailable)
    .map((slot) => slot.slot);

  return {
    available,
    booked,
    filtered: sorted.map((slot) => slot.slot),
    missingEstimatedCpmCount,
    resultCount: sorted.length,
  };
}
