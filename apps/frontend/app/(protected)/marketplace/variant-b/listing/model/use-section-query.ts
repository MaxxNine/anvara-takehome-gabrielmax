'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { MarketplaceFilters } from '../../filters/model/types';
import {
  buildMarketplaceSectionEndpoint,
  createMarketplaceSectionQueryKey,
  DEFAULT_MARKETPLACE_PAGE_SIZE,
} from '../../../marketplace-request';
import type {
  MarketplaceAvailabilitySegment,
  MarketplaceCatalogMeta,
  MarketplaceSectionConnection,
} from '../../../marketplace.types';

type UseMarketplaceSectionQueryOptions = {
  enabled: boolean;
  filters: MarketplaceFilters;
  initialConnection: MarketplaceSectionConnection | null;
  initialFilters: MarketplaceFilters;
  segment: MarketplaceAvailabilitySegment;
};

async function fetchMarketplaceSection(
  filters: MarketplaceFilters,
  segment: MarketplaceAvailabilitySegment,
  cursor?: string | null
) {
  return api<MarketplaceSectionConnection>(buildMarketplaceSectionEndpoint(filters, segment, { cursor }));
}

export function useMarketplaceSectionQuery({
  enabled,
  filters,
  initialConnection,
  initialFilters,
  segment,
}: UseMarketplaceSectionQueryOptions) {
  const queryKey = createMarketplaceSectionQueryKey(
    filters,
    segment,
    DEFAULT_MARKETPLACE_PAGE_SIZE
  );
  const initialQueryKey = createMarketplaceSectionQueryKey(
    initialFilters,
    segment,
    DEFAULT_MARKETPLACE_PAGE_SIZE
  );
  const shouldUseInitialData =
    initialConnection !== null && queryKey[2] === initialQueryKey[2];

  const query = useInfiniteQuery({
    enabled,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor ?? undefined,
    initialData: shouldUseInitialData
      ? {
          pageParams: [null],
          pages: [initialConnection],
        }
      : undefined,
    initialPageParam: null as string | null,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam }) => fetchMarketplaceSection(filters, segment, pageParam),
    queryKey,
  });

  const firstPage = query.data?.pages[0] ?? (shouldUseInitialData ? initialConnection : null);
  const items = query.data?.pages.flatMap((page) => page.items) ?? firstPage?.items ?? [];
  const catalog: MarketplaceCatalogMeta | null = firstPage?.meta.catalog ?? null;
  const totalCount = firstPage?.pageInfo.totalCount ?? 0;
  const isRefreshing =
    enabled &&
    query.fetchStatus === 'fetching' &&
    query.status === 'success' &&
    !query.isFetchingNextPage;

  return {
    catalog,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchNextPageError: query.isFetchNextPageError,
    isFetchingNextPage: query.isFetchingNextPage,
    isInitialError: query.status === 'error' && items.length === 0,
    isInitialLoading: query.isPending && items.length === 0,
    isRefreshing,
    items,
    missingEstimatedCpmCount: firstPage?.meta.missingEstimatedCpmCount ?? 0,
    refetch: query.refetch,
    totalCount,
  };
}

export type MarketplaceSectionQueryState = ReturnType<typeof useMarketplaceSectionQuery>;
