import type { AdSlot } from '@/lib/types';

import type { MarketplaceFilterBounds } from './variant-b/filters/model/types';

export type MarketplaceAvailabilitySegment = 'available' | 'booked';

export type MarketplaceCatalogMeta = {
  availableSlots: number;
  bounds: MarketplaceFilterBounds;
  totalSlots: number;
};

export type MarketplaceSectionPageInfo = {
  hasNextPage: boolean;
  limit: number;
  nextCursor: string | null;
  totalCount: number;
};

export type MarketplaceSectionConnection = {
  items: AdSlot[];
  meta: {
    catalog: MarketplaceCatalogMeta;
    missingEstimatedCpmCount: number;
    segment: MarketplaceAvailabilitySegment;
  };
  pageInfo: MarketplaceSectionPageInfo;
};

export type InitialMarketplaceSections = {
  available: MarketplaceSectionConnection;
  booked: MarketplaceSectionConnection | null;
};
