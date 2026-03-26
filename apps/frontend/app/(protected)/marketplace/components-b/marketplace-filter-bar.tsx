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
  'rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm text-[--color-foreground] focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary] cursor-pointer';

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
    <div className="flex flex-col gap-3 rounded-xl border border-[--color-border] bg-[--color-background] p-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--color-muted]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search placements..."
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] py-2 pl-9 pr-3 text-sm text-[--color-foreground] placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
        />
      </div>

      {/* Type filter */}
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

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className={selectClasses}
      >
        <option value="price-desc">Price: High → Low</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="reach">Highest Reach</option>
      </select>

      {/* Count */}
      <span className="whitespace-nowrap text-sm text-[--color-muted]">
        {resultCount} result{resultCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
