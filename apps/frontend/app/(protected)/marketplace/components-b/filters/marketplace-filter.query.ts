import type { AdSlotType } from '@/lib/types';

import {
  defaultMarketplaceFilters,
  marketplaceSearchParamKeys,
} from './marketplace-filter.constants';
import type {
  MarketplaceFilterBounds,
  MarketplaceFilters,
  MarketplaceSortOption,
  NumericRange,
} from './marketplace-filter.types';
import { clampMarketplaceFilters } from './marketplace-filter.utils';

type SearchParamsRecord = Record<string, string | string[] | undefined>;

const adSlotTypes: ReadonlySet<AdSlotType> = new Set([
  'DISPLAY',
  'VIDEO',
  'NEWSLETTER',
  'PODCAST',
  'NATIVE',
]);

const sortOptions: ReadonlySet<MarketplaceSortOption> = new Set([
  'price-desc',
  'price-asc',
  'reach',
]);

function getFirstValue(
  searchParams: SearchParamsRecord,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseBoolean(value: string | undefined): boolean {
  return value === '1' || value === 'true';
}

function parseNumber(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumericRange(
  minValue: string | undefined,
  maxValue: string | undefined
): NumericRange {
  return {
    max: parseNumber(maxValue),
    min: parseNumber(minValue),
  };
}

export function parseMarketplaceFiltersFromSearchParams(
  searchParams?: SearchParamsRecord,
  bounds?: MarketplaceFilterBounds
): MarketplaceFilters {
  const query = getFirstValue(searchParams ?? {}, 'q') ?? '';
  const type = getFirstValue(searchParams ?? {}, 'type');
  const availability = getFirstValue(searchParams ?? {}, 'availability');
  const verified = getFirstValue(searchParams ?? {}, 'verified');
  const sort = getFirstValue(searchParams ?? {}, 'sort');

  const parsed: MarketplaceFilters = {
    availability: availability === 'all' ? 'all' : defaultMarketplaceFilters.availability,
    estimatedCpm: parseNumericRange(
      getFirstValue(searchParams ?? {}, 'cpmMin'),
      getFirstValue(searchParams ?? {}, 'cpmMax')
    ),
    price: parseNumericRange(
      getFirstValue(searchParams ?? {}, 'priceMin'),
      getFirstValue(searchParams ?? {}, 'priceMax')
    ),
    query,
    sort: sortOptions.has(sort as MarketplaceSortOption)
      ? (sort as MarketplaceSortOption)
      : defaultMarketplaceFilters.sort,
    type: adSlotTypes.has(type as AdSlotType)
      ? (type as AdSlotType)
      : defaultMarketplaceFilters.type,
    verifiedOnly: parseBoolean(verified),
  };

  return bounds ? clampMarketplaceFilters(parsed, bounds) : parsed;
}

function setNumericRange(
  searchParams: URLSearchParams,
  keyPrefix: 'price' | 'cpm',
  range: NumericRange
) {
  const minKey = `${keyPrefix}Min`;
  const maxKey = `${keyPrefix}Max`;

  if (range.min === null) {
    searchParams.delete(minKey);
  } else {
    searchParams.set(minKey, String(range.min));
  }

  if (range.max === null) {
    searchParams.delete(maxKey);
  } else {
    searchParams.set(maxKey, String(range.max));
  }
}

export function serializeMarketplaceFiltersToSearchParams(
  currentSearch: string,
  filters: MarketplaceFilters
): string {
  const searchParams = new URLSearchParams(currentSearch);

  for (const key of marketplaceSearchParamKeys) {
    searchParams.delete(key);
  }

  if (filters.query.trim()) {
    searchParams.set('q', filters.query.trim());
  }

  if (filters.type !== defaultMarketplaceFilters.type) {
    searchParams.set('type', filters.type);
  }

  if (filters.availability !== defaultMarketplaceFilters.availability) {
    searchParams.set('availability', filters.availability);
  }

  if (filters.verifiedOnly) {
    searchParams.set('verified', '1');
  }

  if (filters.sort !== defaultMarketplaceFilters.sort) {
    searchParams.set('sort', filters.sort);
  }

  setNumericRange(searchParams, 'price', filters.price);
  setNumericRange(searchParams, 'cpm', filters.estimatedCpm);

  return searchParams.toString();
}
