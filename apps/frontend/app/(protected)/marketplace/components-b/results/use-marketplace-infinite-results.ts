'use client';

import { useMemo } from 'react';

import type { MarketplaceFilters } from '../filters/marketplace-filter.types';
import type { InitialMarketplaceSections } from '../../marketplace.types';
import { useMarketplaceSectionQuery } from './use-marketplace-section-query';

type UseMarketplaceInfiniteResultsOptions = {
  filters: MarketplaceFilters;
  initialFilters: MarketplaceFilters;
  initialSections: InitialMarketplaceSections;
};

export function useMarketplaceInfiniteResults({
  filters,
  initialFilters,
  initialSections,
}: UseMarketplaceInfiniteResultsOptions) {
  const available = useMarketplaceSectionQuery({
    enabled: true,
    filters,
    initialConnection: initialSections.available,
    initialFilters,
    segment: 'available',
  });
  const showBooked = filters.availability === 'all';
  const booked = useMarketplaceSectionQuery({
    enabled: showBooked,
    filters,
    initialConnection: initialSections.booked,
    initialFilters,
    segment: 'booked',
  });

  const catalog = available.catalog ?? booked.catalog ?? initialSections.available.meta.catalog;

  return useMemo(
    () => ({
      available,
      booked,
      bounds: catalog.bounds,
      catalog,
      missingEstimatedCpmCount:
        available.missingEstimatedCpmCount + (showBooked ? booked.missingEstimatedCpmCount : 0),
      resultCount: available.totalCount + (showBooked ? booked.totalCount : 0),
      showBooked,
    }),
    [available, booked, catalog, showBooked]
  );
}
