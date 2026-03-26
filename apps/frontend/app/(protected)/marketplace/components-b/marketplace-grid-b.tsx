'use client';

import { useMemo, useState } from 'react';

import { homeBDisplayFont } from '@/app/home-b/fonts';
import type { AdSlot, AdSlotType } from '@/lib/types';
import { MarketplaceViewTracker } from '../components/marketplace-view-tracker';
import { AdSlotCardB } from './ad-slot-card-b';
import {
  type EstimatedCpmFilter,
  MarketplaceFilterBar,
  type BudgetFilter,
  type SortOption,
} from './marketplace-filter-bar';
import { getAudienceSize, getEstimatedCpmValue } from './format-helpers';

type MarketplaceGridBProps = {
  adSlots: AdSlot[];
};

function filterAndSort(
  slots: AdSlot[],
  search: string,
  typeFilter: AdSlotType | 'ALL',
  availabilityOnly: boolean,
  budgetFilter: BudgetFilter,
  estimatedCpmFilter: EstimatedCpmFilter,
  verifiedOnly: boolean,
  sort: SortOption,
) {
  let filtered = slots;

  if (availabilityOnly) {
    filtered = filtered.filter((s) => s.isAvailable);
  }

  if (typeFilter !== 'ALL') {
    filtered = filtered.filter((s) => s.type === typeFilter);
  }

  if (verifiedOnly) {
    filtered = filtered.filter((s) => Boolean(s.publisher?.isVerified));
  }

  if (budgetFilter !== 'ALL') {
    filtered = filtered.filter((s) => {
      const price = Number(s.basePrice);

      switch (budgetFilter) {
        case 'UNDER_2K':
          return price < 2000;
        case 'BETWEEN_2K_AND_5K':
          return price >= 2000 && price <= 5000;
        case 'OVER_5K':
          return price > 5000;
        default:
          return true;
      }
    });
  }

  if (estimatedCpmFilter !== 'ALL') {
    filtered = filtered.filter((slot) => {
      const estimatedCpm = getEstimatedCpmValue(Number(slot.basePrice), getAudienceSize(slot));

      if (estimatedCpm === null) {
        return false;
      }

      switch (estimatedCpmFilter) {
        case 'UNDER_10':
          return estimatedCpm < 10;
        case 'BETWEEN_10_AND_25':
          return estimatedCpm >= 10 && estimatedCpm <= 25;
        case 'OVER_25':
          return estimatedCpm > 25;
        default:
          return true;
      }
    });
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.publisher?.name.toLowerCase().includes(q),
    );
  }

  const sorted = [...filtered];
  switch (sort) {
    case 'price-desc':
      sorted.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
      break;
    case 'price-asc':
      sorted.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
      break;
    case 'reach':
      sorted.sort(
        (a, b) => (b.publisher?.monthlyViews ?? 0) - (a.publisher?.monthlyViews ?? 0),
      );
      break;
  }

  return sorted;
}

export function MarketplaceGridB({ adSlots }: MarketplaceGridBProps) {
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AdSlotType | 'ALL'>('ALL');
  const [availabilityOnly, setAvailabilityOnly] = useState(true);
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('ALL');
  const [estimatedCpmFilter, setEstimatedCpmFilter] = useState<EstimatedCpmFilter>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>('price-desc');

  const filtered = useMemo(
    () =>
      filterAndSort(
        adSlots,
        search,
        typeFilter,
        availabilityOnly,
        budgetFilter,
        estimatedCpmFilter,
        verifiedOnly,
        sort
      ),
    [adSlots, availabilityOnly, budgetFilter, estimatedCpmFilter, search, typeFilter, verifiedOnly, sort],
  );

  const available = filtered.filter((s) => s.isAvailable);
  const booked = filtered.filter((s) => !s.isAvailable);

  return (
    <div className="theme-home-b min-h-screen pb-16 pt-24 sm:pt-28">
      <MarketplaceViewTracker resultsCount={adSlots.length} />

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
            </div>

            <MarketplaceFilterBar
              advancedFiltersOpen={advancedFiltersOpen}
              onAdvancedFiltersToggle={() => setAdvancedFiltersOpen((current) => !current)}
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              availabilityOnly={availabilityOnly}
              onAvailabilityToggle={() => setAvailabilityOnly((current) => !current)}
              budgetFilter={budgetFilter}
              onBudgetFilterChange={setBudgetFilter}
              estimatedCpmFilter={estimatedCpmFilter}
              onEstimatedCpmFilterChange={setEstimatedCpmFilter}
              verifiedOnly={verifiedOnly}
              onVerifiedToggle={() => setVerifiedOnly((current) => !current)}
              sort={sort}
              onSortChange={setSort}
              resultCount={filtered.length}
            />
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                Available placements
              </h2>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Browse {adSlots.filter((s) => s.isAvailable).length} placements from verified publishers.
              </p>
            </div>
          </div>

          {available.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/85 p-12 text-center text-slate-600">
              No placements match your filters. Try adjusting your search.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {available.map((slot) => (
                <AdSlotCardB key={slot.id} slot={slot} />
              ))}
            </div>
          )}
        </section>

        {booked.length > 0 && (
          <section className="space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.22)]">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Currently booked
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {booked.length} placement{booked.length !== 1 ? 's are' : ' is'} unavailable right now.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {booked.map((slot) => (
                <AdSlotCardB key={slot.id} slot={slot} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
