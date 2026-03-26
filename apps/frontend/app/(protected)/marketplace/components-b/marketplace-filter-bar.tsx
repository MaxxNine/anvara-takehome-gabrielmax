'use client';

import { Search } from 'lucide-react';

import type { AdSlotType } from '@/lib/types';

export type BudgetFilter = 'ALL' | 'UNDER_2K' | 'BETWEEN_2K_AND_5K' | 'OVER_5K';
export type SortOption = 'price-desc' | 'price-asc' | 'reach';

type MarketplaceFilterBarProps = {
  availabilityOnly: boolean;
  budgetFilter: BudgetFilter;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onTypeChange: (value: AdSlotType | 'ALL') => void;
  onAvailabilityToggle: () => void;
  onBudgetFilterChange: (value: BudgetFilter) => void;
  resultCount: number;
  search: string;
  sort: SortOption;
  typeFilter: AdSlotType | 'ALL';
};

const selectClasses =
  'h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15 cursor-pointer';

export function MarketplaceFilterBar({
  availabilityOnly,
  budgetFilter,
  onSearchChange,
  onSortChange,
  onTypeChange,
  onAvailabilityToggle,
  onBudgetFilterChange,
  resultCount,
  search,
  sort,
  typeFilter,
}: MarketplaceFilterBarProps) {
  const quickFilters: { label: string; value: BudgetFilter }[] = [
    { label: 'Under $2k', value: 'UNDER_2K' },
    { label: '$2k-$5k', value: 'BETWEEN_2K_AND_5K' },
    { label: '$5k+', value: 'OVER_5K' },
  ];

  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search placements..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15"
          />
        </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:flex lg:items-center">
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value as AdSlotType | 'ALL')}
              className={selectClasses}
            >
              <option value="ALL">All Types</option>
              <option value="DISPLAY">Display</option>
              <option value="VIDEO">Video</option>
              <option value="NEWSLETTER">Newsletter</option>
              <option value="PODCAST">Podcast</option>
              <option value="NATIVE">Native</option>
            </select>

            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={selectClasses}
            >
              <option value="price-desc">Price: High → Low</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="reach">Highest Reach</option>
            </select>

            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-[#1b64f2]">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAvailabilityToggle}
            className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
              availabilityOnly
                ? 'border-blue-200 bg-blue-50 text-[#1b64f2]'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950'
            }`}
          >
            Available now
          </button>

          {quickFilters.map((filter) => {
            const selected = budgetFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onBudgetFilterChange(selected ? 'ALL' : filter.value)}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  selected
                    ? 'border-blue-200 bg-blue-50 text-[#1b64f2]'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
