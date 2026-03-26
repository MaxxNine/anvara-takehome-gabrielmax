'use client';

import type { ReactNode } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Gauge,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Tag,
} from 'lucide-react';

import type { AdSlotType } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';

import {
  marketplaceCategoryOptions,
  marketplaceSortOptions,
} from '../model/constants';
import type {
  MarketplaceFilterBounds,
  MarketplaceFilters,
  MarketplaceSortOption,
} from '../model/types';
import type { MarketplaceFilterActions } from '../model/use-filters';
import { MarketplaceChipGroup } from './chip-group';
import { MarketplaceRangeFilter } from './range-filter';
import { MarketplaceToggleChip } from './toggle-chip';

type MarketplaceFiltersPanelProps = {
  actions: MarketplaceFilterActions;
  activeAdvancedFilterCount: number;
  advancedFiltersOpen: boolean;
  bounds: MarketplaceFilterBounds;
  filters: MarketplaceFilters;
  hasActiveFilters: boolean;
  missingEstimatedCpmCount: number;
  resultCount: number;
};

const selectClasses =
  'h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15 cursor-pointer';

function formatCpmValue(value: number): string {
  return `$${value.toFixed(value >= 10 ? 0 : 1)}`;
}

function FilterGroup({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-slate-400">{icon}</span>
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

export function MarketplaceFiltersPanel({
  actions,
  activeAdvancedFilterCount,
  advancedFiltersOpen,
  bounds,
  filters,
  hasActiveFilters,
  missingEstimatedCpmCount,
  resultCount,
}: MarketplaceFiltersPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const advancedPanelId = 'marketplace-advanced-filters';
  const activeCpmHelperText =
    (filters.estimatedCpm.min !== null || filters.estimatedCpm.max !== null) &&
    missingEstimatedCpmCount > 0
      ? `${missingEstimatedCpmCount} listings were excluded because CPM could not be estimated.`
      : null;

  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={filters.query}
              onChange={(event) => actions.setQuery(event.target.value)}
              placeholder="Search placements, publishers, or formats..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:flex lg:items-center">
            <select
              value={filters.sort}
              onChange={(event) => actions.setSort(event.target.value as MarketplaceSortOption)}
              className={selectClasses}
            >
              {marketplaceSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={actions.toggleAdvancedFilters}
              aria-expanded={advancedFiltersOpen}
              aria-controls={advancedPanelId}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b64f2]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Advanced filters</span>
              {activeAdvancedFilterCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-50 px-1.5 text-xs font-semibold text-[#1b64f2]">
                  {activeAdvancedFilterCount}
                </span>
              ) : null}
              {advancedFiltersOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={actions.resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            ) : null}

            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-[#1b64f2]">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {advancedFiltersOpen ? (
            <motion.div
              id={advancedPanelId}
              key="advanced-filters"
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
              }
              className="overflow-hidden"
            >
              <motion.div
                initial={shouldReduceMotion ? false : { y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                }
                className="grid gap-5 border-t border-slate-200/80 pt-4 md:grid-cols-2 xl:grid-cols-4"
              >
                <FilterGroup icon={<Tag className="h-4 w-4" />} label="Categories">
                  <MarketplaceChipGroup<AdSlotType | 'ALL'>
                    selectedValue={filters.type}
                    options={marketplaceCategoryOptions}
                    onChange={actions.setType}
                  />
                </FilterGroup>

                <FilterGroup icon={<DollarSign className="h-4 w-4" />} label="Monthly slot price">
                  <MarketplaceRangeFilter
                    bounds={bounds.price}
                    disabledLabel="Price data is not available for these listings."
                    formatValue={(value) => formatPrice(value, 'en-US')}
                    minInputLabel="Minimum price"
                    maxInputLabel="Maximum price"
                    onChange={actions.setPrice}
                    step={50}
                    value={filters.price}
                  />
                </FilterGroup>

                <FilterGroup icon={<Gauge className="h-4 w-4" />} label="Estimated CPM">
                  <MarketplaceRangeFilter
                    bounds={bounds.estimatedCpm}
                    disabledLabel="No listings currently have enough audience data for a CPM estimate."
                    formatValue={formatCpmValue}
                    helperText={activeCpmHelperText}
                    minInputLabel="Minimum CPM"
                    maxInputLabel="Maximum CPM"
                    onChange={actions.setEstimatedCpm}
                    step={0.5}
                    value={filters.estimatedCpm}
                  />
                </FilterGroup>

                <FilterGroup icon={<BadgeCheck className="h-4 w-4" />} label="Listing checks">
                  <div className="flex flex-wrap gap-2">
                    <MarketplaceToggleChip
                      pressed={filters.availability === 'available'}
                      onClick={() =>
                        actions.setAvailability(
                          filters.availability === 'available' ? 'all' : 'available'
                        )
                      }
                      icon={<CheckCircle2 className="h-4 w-4" />}
                    >
                      Available now
                    </MarketplaceToggleChip>

                    <MarketplaceToggleChip
                      pressed={filters.verifiedOnly}
                      onClick={() => actions.setVerifiedOnly(!filters.verifiedOnly)}
                      icon={<BadgeCheck className="h-4 w-4" />}
                    >
                      Verified publishers
                    </MarketplaceToggleChip>
                  </div>

                  <p
                    className={cn(
                      'text-xs leading-5 text-slate-500',
                      filters.availability === 'available' ? '' : 'text-[#1b64f2]'
                    )}
                  >
                    {filters.availability === 'available'
                      ? 'Booked placements are hidden by default.'
                      : 'Booked placements are included in the results.'}
                  </p>
                </FilterGroup>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
