import type { AdSlot, AdSlotType } from '@/lib/types';

export type AvailabilityFilter = 'available' | 'all';
export type MarketplaceSortOption = 'price-desc' | 'price-asc' | 'reach';

export type NumericRange = {
  max: number | null;
  min: number | null;
};

export type NumericRangeBounds = {
  hasData: boolean;
  max: number;
  min: number;
};

export type MarketplaceFilterBounds = {
  estimatedCpm: NumericRangeBounds;
  price: NumericRangeBounds;
};

export type MarketplaceFilters = {
  availability: AvailabilityFilter;
  estimatedCpm: NumericRange;
  price: NumericRange;
  query: string;
  sort: MarketplaceSortOption;
  type: AdSlotType | 'ALL';
  verifiedOnly: boolean;
};

export type MarketplaceFilterUiState = {
  advancedOpen: boolean;
};

export type NormalizedMarketplaceSlot = {
  audienceSize: number | null;
  estimatedCpm: number | null;
  isVerified: boolean;
  price: number;
  reach: number;
  searchIndex: string;
  slot: AdSlot;
};

export type MarketplaceFilterResults = {
  available: AdSlot[];
  booked: AdSlot[];
  filtered: AdSlot[];
  missingEstimatedCpmCount: number;
  resultCount: number;
};
