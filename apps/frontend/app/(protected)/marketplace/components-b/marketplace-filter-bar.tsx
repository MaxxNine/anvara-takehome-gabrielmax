'use client';

import { Search } from 'lucide-react';

import type { AdSlotType } from '@/lib/types';

export type SortOption = 'price-desc' | 'price-asc' | 'reach';

type MarketplaceFilterBarProps = {
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onTypeChange: (value: AdSlotType | 'ALL') => void;
  resultCount: number;
  search: string;
  sort: SortOption;
  typeFilter: AdSlotType | 'ALL';
};

const selectClasses =
  'h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15 cursor-pointer';

export function MarketplaceFilterBar({
  onSearchChange,
  onSortChange,
  onTypeChange,
  resultCount,
  search,
  sort,
  typeFilter,
}: MarketplaceFilterBarProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-5">
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
    </div>
  );
}
