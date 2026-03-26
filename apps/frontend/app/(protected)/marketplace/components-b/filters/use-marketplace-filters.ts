'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';

import type { AdSlotType } from '@/lib/types';

import { defaultMarketplaceFilters } from './marketplace-filter.constants';
import { serializeMarketplaceFiltersToSearchParams } from './marketplace-filter.query';
import type {
  MarketplaceFilterBounds,
  MarketplaceFilters,
  MarketplaceSortOption,
  NumericRange,
} from './marketplace-filter.types';
import {
  clampMarketplaceFilters,
  getActiveAdvancedFilterCount,
  hasActiveMarketplaceFilters,
} from './marketplace-filter.utils';

type UseMarketplaceFiltersOptions = {
  bounds: MarketplaceFilterBounds;
  initialFilters: MarketplaceFilters;
};

export type MarketplaceFilterActions = {
  resetFilters: () => void;
  setAvailability: (value: MarketplaceFilters['availability']) => void;
  setEstimatedCpm: (value: NumericRange) => void;
  setPrice: (value: NumericRange) => void;
  setQuery: (value: string) => void;
  setSort: (value: MarketplaceSortOption) => void;
  setType: (value: AdSlotType | 'ALL') => void;
  setVerifiedOnly: (value: boolean) => void;
  toggleAdvancedFilters: () => void;
};

export type UseMarketplaceFiltersResult = {
  actions: MarketplaceFilterActions;
  activeAdvancedFilterCount: number;
  bounds: MarketplaceFilterBounds;
  filters: MarketplaceFilters;
  hasActiveFilters: boolean;
  requestFilters: MarketplaceFilters;
  ui: {
    advancedFiltersOpen: boolean;
  };
};

export function useMarketplaceFilters({
  bounds,
  initialFilters,
}: UseMarketplaceFiltersOptions): UseMarketplaceFiltersResult {
  const [filters, setFilters] = useState(() => clampMarketplaceFilters(initialFilters, bounds));
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(
    () => getActiveAdvancedFilterCount(initialFilters) > 0
  );
  const deferredQuery = useDeferredValue(filters.query);

  useEffect(() => {
    setFilters((current) => clampMarketplaceFilters(current, bounds));
  }, [bounds]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearch = serializeMarketplaceFiltersToSearchParams(window.location.search, filters);
      const nextUrl = nextSearch
        ? `${window.location.pathname}?${nextSearch}${window.location.hash}`
        : `${window.location.pathname}${window.location.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (nextUrl !== currentUrl) {
        window.history.replaceState(window.history.state, '', nextUrl);
      }
    }, 160);

    return () => window.clearTimeout(timeoutId);
  }, [filters]);

  const requestFilters = useMemo(
    () =>
      clampMarketplaceFilters(
        {
          ...filters,
          query: deferredQuery,
        },
        bounds
      ),
    [bounds, deferredQuery, filters]
  );

  const actions: MarketplaceFilterActions = {
    resetFilters: () => setFilters(clampMarketplaceFilters(defaultMarketplaceFilters, bounds)),
    setAvailability: (value) =>
      setFilters((current) =>
        clampMarketplaceFilters(
          {
            ...current,
            availability: value,
          },
          bounds
        )
      ),
    setEstimatedCpm: (value) =>
      setFilters((current) =>
        clampMarketplaceFilters(
          {
            ...current,
            estimatedCpm: value,
          },
          bounds
        )
      ),
    setPrice: (value) =>
      setFilters((current) =>
        clampMarketplaceFilters(
          {
            ...current,
            price: value,
          },
          bounds
        )
      ),
    setQuery: (value) =>
      setFilters((current) => ({
        ...current,
        query: value,
      })),
    setSort: (value) =>
      setFilters((current) => ({
        ...current,
        sort: value,
      })),
    setType: (value) =>
      setFilters((current) => ({
        ...current,
        type: value,
      })),
    setVerifiedOnly: (value) =>
      setFilters((current) => ({
        ...current,
        verifiedOnly: value,
      })),
    toggleAdvancedFilters: () => setAdvancedFiltersOpen((current) => !current),
  };

  return {
    actions,
    activeAdvancedFilterCount: getActiveAdvancedFilterCount(filters),
    bounds,
    filters,
    hasActiveFilters: hasActiveMarketplaceFilters(filters),
    requestFilters,
    ui: {
      advancedFiltersOpen,
    },
  };
}
