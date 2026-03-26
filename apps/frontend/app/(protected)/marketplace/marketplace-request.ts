import { defaultMarketplaceFilters } from './variant-b/filters/model/constants';
import type { MarketplaceFilters, NumericRange } from './variant-b/filters/model/types';
import type { MarketplaceAvailabilitySegment } from './marketplace.types';

export const DEFAULT_MARKETPLACE_PAGE_SIZE = 10;

function appendRange(
  searchParams: URLSearchParams,
  keyPrefix: 'price' | 'cpm',
  range: NumericRange
) {
  if (range.min !== null) {
    searchParams.set(`${keyPrefix}Min`, String(range.min));
  }

  if (range.max !== null) {
    searchParams.set(`${keyPrefix}Max`, String(range.max));
  }
}

export function buildMarketplaceSectionSearchParams(
  filters: MarketplaceFilters,
  segment: MarketplaceAvailabilitySegment,
  options: {
    cursor?: string | null;
    limit?: number;
  } = {}
): URLSearchParams {
  const searchParams = new URLSearchParams();

  searchParams.set('limit', String(options.limit ?? DEFAULT_MARKETPLACE_PAGE_SIZE));
  searchParams.set('segment', segment);

  if (filters.query.trim()) {
    searchParams.set('q', filters.query.trim());
  }

  if (filters.type !== defaultMarketplaceFilters.type) {
    searchParams.set('type', filters.type);
  }

  if (filters.verifiedOnly) {
    searchParams.set('verified', '1');
  }

  if (filters.sort !== defaultMarketplaceFilters.sort) {
    searchParams.set('sort', filters.sort);
  }

  appendRange(searchParams, 'price', filters.price);
  appendRange(searchParams, 'cpm', filters.estimatedCpm);

  if (options.cursor) {
    searchParams.set('cursor', options.cursor);
  }

  return searchParams;
}

export function buildMarketplaceSectionEndpoint(
  filters: MarketplaceFilters,
  segment: MarketplaceAvailabilitySegment,
  options: {
    cursor?: string | null;
    limit?: number;
  } = {}
): string {
  return `/api/ad-slots/marketplace?${buildMarketplaceSectionSearchParams(
    filters,
    segment,
    options
  ).toString()}`;
}

export function createMarketplaceSectionQueryKey(
  filters: MarketplaceFilters,
  segment: MarketplaceAvailabilitySegment,
  limit = DEFAULT_MARKETPLACE_PAGE_SIZE
) {
  return [
    'marketplace',
    'section',
    buildMarketplaceSectionEndpoint(filters, segment, { limit }),
  ] as const;
}
