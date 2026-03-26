import type { AdSlotTypeValue } from '../../types/ad-slot.js';
import type {
  MarketplaceAdSlotFilters,
  MarketplaceAvailabilitySegment,
  MarketplaceNumericRange,
  MarketplaceSortOption,
} from '../../types/index.js';
import { isAdSlotType } from '../../services/ad-slot/index.js';

const DEFAULT_MARKETPLACE_LIMIT = 10;
const MAX_MARKETPLACE_LIMIT = 30;

const marketplaceSegments = new Set<MarketplaceAvailabilitySegment>(['available', 'booked']);
const marketplaceSortOptions = new Set<MarketplaceSortOption>([
  'price-desc',
  'price-asc',
  'reach',
]);

function getQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

function parseBoolean(value: unknown): boolean {
  const normalized = getQueryValue(value);
  return normalized === '1' || normalized === 'true';
}

function parseNumber(value: unknown): number | null {
  const normalized = getQueryValue(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseRange(minValue: unknown, maxValue: unknown): MarketplaceNumericRange {
  const min = parseNumber(minValue);
  const max = parseNumber(maxValue);

  if (min !== null && max !== null && min > max) {
    return { max: min, min: max };
  }

  return { max, min };
}

function parseLimit(value: unknown): number {
  const parsed = parseNumber(value);

  if (parsed === null || parsed <= 0) {
    return DEFAULT_MARKETPLACE_LIMIT;
  }

  return Math.min(Math.floor(parsed), MAX_MARKETPLACE_LIMIT);
}

function parseSort(value: unknown): MarketplaceSortOption {
  const sort = getQueryValue(value);
  return marketplaceSortOptions.has(sort as MarketplaceSortOption)
    ? (sort as MarketplaceSortOption)
    : 'price-desc';
}

function parseSegment(value: unknown): MarketplaceAvailabilitySegment {
  const segment = getQueryValue(value);
  return marketplaceSegments.has(segment as MarketplaceAvailabilitySegment)
    ? (segment as MarketplaceAvailabilitySegment)
    : 'available';
}

function parseAdSlotType(value: unknown): AdSlotTypeValue | undefined {
  const type = getQueryValue(value);
  return isAdSlotType(type) ? type : undefined;
}

export function parseMarketplaceAdSlotFilters(
  query: Record<string, unknown>,
  publisherId?: string
): MarketplaceAdSlotFilters {
  const searchQuery = getQueryValue(query.q)?.trim();
  const cursor = getQueryValue(query.cursor)?.trim();
  const adSlotType = parseAdSlotType(query.type);

  return {
    ...(cursor ? { cursor } : {}),
    estimatedCpm: parseRange(query.cpmMin, query.cpmMax),
    limit: parseLimit(query.limit),
    price: parseRange(query.priceMin, query.priceMax),
    ...(publisherId ? { publisherId } : {}),
    ...(searchQuery ? { query: searchQuery } : {}),
    segment: parseSegment(query.segment),
    sort: parseSort(query.sort),
    ...(adSlotType ? { type: adSlotType } : {}),
    verifiedOnly: parseBoolean(query.verified),
  };
}
