'use client';

import { homeBDisplayFont } from '@/app/home-b/fonts';

import type { InitialMarketplaceSections } from '../marketplace.types';
import { MarketplaceViewTracker } from '../components/marketplace-view-tracker';
import type { MarketplaceFilters } from './filters/model/types';
import { useMarketplaceFilters } from './filters/model/use-filters';
import { MarketplaceFiltersPanel } from './filters/ui/panel';
import { useMarketplaceInfiniteResults } from './listing/model/use-infinite-results';
import { MarketplaceResultsB } from './listing/ui/results-list';

type MarketplaceGridBProps = {
  initialFilters: MarketplaceFilters;
  initialSections: InitialMarketplaceSections;
};

export function MarketplaceGridB({
  initialFilters,
  initialSections,
}: MarketplaceGridBProps) {
  const initialBounds = initialSections.available.meta.catalog.bounds;
  const {
    actions,
    activeAdvancedFilterCount,
    bounds,
    filters,
    hasActiveFilters,
    requestFilters,
    ui,
  } = useMarketplaceFilters({
    bounds: initialBounds,
    initialFilters,
  });
  const results = useMarketplaceInfiniteResults({
    filters: requestFilters,
    initialFilters,
    initialSections,
  });

  return (
    <div className="theme-home-b min-h-screen pb-16 pt-24 sm:pt-28">
      <MarketplaceViewTracker resultsCount={results.catalog.totalSlots} />

      <div className="space-y-8 sm:space-y-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,255,0.96))] p-6 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.24)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_right,rgba(27,100,242,0.12),rgba(255,255,255,0)_54%)]" />

          <div className="relative space-y-6">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1b64f2]/70">
                Verified sponsorship marketplace
              </p>
              <h1
                className={`${homeBDisplayFont.className} mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl`}
              >
                Find placements that fit the campaign.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Compare verified display, video, podcast, newsletter, and native inventory with
                transparent pricing, audience reach, and publisher context upfront.
              </p>
              <p className="mt-4 text-sm text-slate-500 sm:text-base">
                {results.catalog.availableSlots} placements are currently available across the
                marketplace.
              </p>
            </div>

            <MarketplaceFiltersPanel
              actions={actions}
              activeAdvancedFilterCount={activeAdvancedFilterCount}
              advancedFiltersOpen={ui.advancedFiltersOpen}
              bounds={bounds}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              missingEstimatedCpmCount={results.missingEstimatedCpmCount}
              resultCount={results.resultCount}
            />
          </div>
        </section>

        <MarketplaceResultsB
          available={results.available}
          booked={results.booked}
          showBooked={results.showBooked}
        />
      </div>
    </div>
  );
}
