import { headers } from 'next/headers';

import { AdSlotGrid } from './components/ad-slot-grid';
import { getMarketplaceAdSlots } from './data';

export default async function MarketplacePage() {
  const requestHeaders = await headers();
  const adSlots = await getMarketplaceAdSlots(requestHeaders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
        {/* TODO: Add search input and filter controls */}
      </div>

      <AdSlotGrid adSlots={adSlots} />
    </div>
  );
}
