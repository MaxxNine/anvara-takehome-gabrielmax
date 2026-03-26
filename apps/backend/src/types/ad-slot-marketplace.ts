import type { AdSlotTypeValue } from './ad-slot.js';

export type MarketplaceAvailabilitySegment = 'available' | 'booked';
export type MarketplaceSortOption = 'price-desc' | 'price-asc' | 'reach';

export interface MarketplaceNumericRange {
  max: number | null;
  min: number | null;
}

export interface MarketplaceAdSlotFilters {
  cursor?: string;
  estimatedCpm: MarketplaceNumericRange;
  limit: number;
  price: MarketplaceNumericRange;
  publisherId?: string;
  query?: string;
  segment: MarketplaceAvailabilitySegment;
  sort: MarketplaceSortOption;
  type?: AdSlotTypeValue;
  verifiedOnly: boolean;
}

export interface MarketplaceFilterBounds {
  estimatedCpm: { hasData: boolean; max: number; min: number };
  price: { hasData: boolean; max: number; min: number };
}

export interface MarketplaceCatalogMeta {
  availableSlots: number;
  bounds: MarketplaceFilterBounds;
  totalSlots: number;
}

export interface MarketplaceConnectionPageInfo {
  hasNextPage: boolean;
  limit: number;
  nextCursor: string | null;
  totalCount: number;
}

export interface MarketplaceAdSlotConnection<TItem = unknown> {
  items: TItem[];
  meta: {
    catalog: MarketplaceCatalogMeta;
    missingEstimatedCpmCount: number;
    segment: MarketplaceAvailabilitySegment;
  };
  pageInfo: MarketplaceConnectionPageInfo;
}
