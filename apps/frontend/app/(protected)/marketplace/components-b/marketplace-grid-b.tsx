'use client';

import { useMemo, useState } from 'react';

import type { AdSlot, AdSlotType } from '@/lib/types';
import { MarketplaceViewTracker } from '../components/marketplace-view-tracker';
import { AdSlotCardB } from './ad-slot-card-b';
import { MarketplaceFilterBar, type SortOption } from './marketplace-filter-bar';

type MarketplaceGridBProps = {
  adSlots: AdSlot[];
};

function filterAndSort(
  slots: AdSlot[],
  search: string,
  typeFilter: AdSlotType | 'ALL',
  sort: SortOption,
) {
  let filtered = slots;

  if (typeFilter !== 'ALL') {
    filtered = filtered.filter((s) => s.type === typeFilter);
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
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AdSlotType | 'ALL'>('ALL');
  const [sort, setSort] = useState<SortOption>('price-desc');

  const filtered = useMemo(
    () => filterAndSort(adSlots, search, typeFilter, sort),
    [adSlots, search, typeFilter, sort],
  );

  const available = filtered.filter((s) => s.isAvailable);
  const booked = filtered.filter((s) => !s.isAvailable);

  return (
    <div className="space-y-6">
      <MarketplaceViewTracker resultsCount={adSlots.length} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="mt-1 text-[--color-muted]">
          Browse {adSlots.filter((s) => s.isAvailable).length} available placements from verified publishers
        </p>
      </div>

      {/* Filters */}
      <MarketplaceFilterBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        sort={sort}
        onSortChange={setSort}
        resultCount={available.length}
      />

      {/* Available listings */}
      {available.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[--color-border] p-12 text-center text-[--color-muted]">
          No placements match your filters. Try adjusting your search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((slot) => (
            <AdSlotCardB key={slot.id} slot={slot} />
          ))}
        </div>
      )}

      {/* Booked listings */}
      {booked.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[--color-muted]">
            Currently Booked ({booked.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {booked.map((slot) => (
              <AdSlotCardB key={slot.id} slot={slot} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
