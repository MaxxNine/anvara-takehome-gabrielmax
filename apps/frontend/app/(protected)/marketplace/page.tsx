import { headers } from 'next/headers';

import { getForcedABTestVariant } from '@/lib/ab-testing';
import { getServerABVariant } from '@/lib/ab-testing/server';

import { MarketplaceGridB } from './components-b/marketplace-grid-b';
import { parseMarketplaceFiltersFromSearchParams } from './components-b/filters/marketplace-filter.query';
import { AdSlotGrid } from './components/ad-slot-grid';
import { getInitialMarketplaceSections, getMarketplaceAdSlots } from './data';

type MarketplacePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const initialFilters = parseMarketplaceFiltersFromSearchParams(resolvedSearchParams);
  const [requestHeaders, marketplaceVariant] = await Promise.all([
    headers(),
    getServerABVariant('marketplace-layout', {
      forcedVariant: getForcedABTestVariant('marketplace-layout', resolvedSearchParams),
    }),
  ]);

  if (marketplaceVariant === 'B') {
    const initialSections = await getInitialMarketplaceSections(initialFilters, requestHeaders);

    return (
      <MarketplaceGridB initialFilters={initialFilters} initialSections={initialSections} />
    );
  }

  const adSlots = await getMarketplaceAdSlots(requestHeaders);

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
