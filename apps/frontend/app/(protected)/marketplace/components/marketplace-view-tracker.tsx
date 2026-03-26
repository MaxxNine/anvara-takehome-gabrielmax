'use client';

import { GA_EVENTS, useTrackOnMount } from '@/lib/analytics';

type MarketplaceViewTrackerProps = {
  resultsCount: number;
};

export function MarketplaceViewTracker({ resultsCount }: MarketplaceViewTrackerProps) {
  useTrackOnMount(
    GA_EVENTS.MARKETPLACE_VIEW,
    {
      conversion_type: 'micro',
      results_count: resultsCount,
    },
    {
      dedupeKey: 'marketplace_view:/marketplace',
    }
  );

  return null;
}
