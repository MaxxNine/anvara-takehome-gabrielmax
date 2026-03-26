import type { AdSlotType } from '@/lib/types';

import type {
  MarketplaceFilters,
  MarketplaceSortOption,
  NumericRange,
} from './types';

export type FilterChipOption<T extends string> = {
  label: string;
  value: T;
};

export const emptyNumericRange: NumericRange = {
  max: null,
  min: null,
};

export const defaultMarketplaceFilters: MarketplaceFilters = {
  availability: 'available',
  estimatedCpm: emptyNumericRange,
  price: emptyNumericRange,
  query: '',
  sort: 'price-desc',
  type: 'ALL',
  verifiedOnly: false,
};

export const marketplaceSearchParamKeys = [
  'availability',
  'cpmMax',
  'cpmMin',
  'priceMax',
  'priceMin',
  'q',
  'sort',
  'type',
  'verified',
] as const;

export const marketplaceCategoryOptions: FilterChipOption<AdSlotType | 'ALL'>[] = [
  { label: 'All categories', value: 'ALL' },
  { label: 'Display', value: 'DISPLAY' },
  { label: 'Video', value: 'VIDEO' },
  { label: 'Newsletter', value: 'NEWSLETTER' },
  { label: 'Podcast', value: 'PODCAST' },
  { label: 'Native', value: 'NATIVE' },
];

export const marketplaceSortOptions: FilterChipOption<MarketplaceSortOption>[] = [
  { label: 'Price: High -> Low', value: 'price-desc' },
  { label: 'Price: Low -> High', value: 'price-asc' },
  { label: 'Highest Reach', value: 'reach' },
];
