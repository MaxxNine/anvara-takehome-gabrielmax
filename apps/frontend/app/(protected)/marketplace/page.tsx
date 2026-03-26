import { headers } from 'next/headers';

import { getForcedABTestVariant } from '@/lib/ab-testing';
import { getServerABVariant } from '@/lib/ab-testing/server';

import { MarketplaceGridB } from './components-b/marketplace-grid-b';
import { parseMarketplaceFiltersFromSearchParams } from './components-b/marketplace-filter.query';
import { AdSlotGrid } from './components/ad-slot-grid';
import { getMarketplaceAdSlots } from './data';

type MarketplacePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const [adSlots, marketplaceVariant] = await Promise.all([
    getMarketplaceAdSlots(requestHeaders),
    getServerABVariant('marketplace-layout', {
      forcedVariant: getForcedABTestVariant('marketplace-layout', resolvedSearchParams),
    }),
  ]);

  if (marketplaceVariant === 'B') {
    return (
      <MarketplaceGridB
        adSlots={adSlots}
        initialFilters={parseMarketplaceFiltersFromSearchParams(resolvedSearchParams)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
      </div>

      <AdSlotGrid adSlots={adSlots} />
    </div>
  );
}
