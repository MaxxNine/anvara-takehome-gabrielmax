import 'server-only';

import type { AdSlot } from '@/lib/types';
import { serverApi, type ForwardedRequestHeaders } from '@/lib/server-api';

import type { MarketplaceFilters } from './components-b/filters/marketplace-filter.types';
import { buildMarketplaceSectionEndpoint } from './marketplace-request';
import type {
  InitialMarketplaceSections,
  MarketplaceAvailabilitySegment,
  MarketplaceSectionConnection,
} from './marketplace.types';

export async function getMarketplaceAdSlots(
  requestHeaders?: ForwardedRequestHeaders
): Promise<AdSlot[]> {
  return serverApi<AdSlot[]>('/api/ad-slots', {
    cache: 'no-store',
    requestHeaders,
  });
}

async function getMarketplaceSection(
  filters: MarketplaceFilters,
  segment: MarketplaceAvailabilitySegment,
  requestHeaders?: ForwardedRequestHeaders
): Promise<MarketplaceSectionConnection> {
  return serverApi<MarketplaceSectionConnection>(buildMarketplaceSectionEndpoint(filters, segment), {
    cache: 'no-store',
    requestHeaders,
  });
}

export async function getInitialMarketplaceSections(
  filters: MarketplaceFilters,
  requestHeaders?: ForwardedRequestHeaders
): Promise<InitialMarketplaceSections> {
  const [available, booked] = await Promise.all([
    getMarketplaceSection(filters, 'available', requestHeaders),
    filters.availability === 'all'
      ? getMarketplaceSection(filters, 'booked', requestHeaders)
      : Promise.resolve(null),
  ]);

  return {
    available,
    booked,
  };
}
