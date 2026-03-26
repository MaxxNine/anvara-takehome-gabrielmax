'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Gauge,
  Search,
  SlidersHorizontal,
  Tag,
} from 'lucide-react';

import type { AdSlotType } from '@/lib/types';

export type BudgetFilter = 'ALL' | 'UNDER_2K' | 'BETWEEN_2K_AND_5K' | 'OVER_5K';
export type EstimatedCpmFilter = 'ALL' | 'UNDER_10' | 'BETWEEN_10_AND_25' | 'OVER_25';
export type SortOption = 'price-desc' | 'price-asc' | 'reach';

type MarketplaceFilterBarProps = {
  advancedFiltersOpen: boolean;
  availabilityOnly: boolean;
  budgetFilter: BudgetFilter;
  estimatedCpmFilter: EstimatedCpmFilter;
  onAdvancedFiltersToggle: () => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onTypeChange: (value: AdSlotType | 'ALL') => void;
  onAvailabilityToggle: () => void;
  onBudgetFilterChange: (value: BudgetFilter) => void;
  onEstimatedCpmFilterChange: (value: EstimatedCpmFilter) => void;
  onVerifiedToggle: () => void;
  resultCount: number;
  search: string;
  sort: SortOption;
  typeFilter: AdSlotType | 'ALL';
  verifiedOnly: boolean;
};

const selectClasses =
  'h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15 cursor-pointer';
const filterChipClasses =
  'inline-flex cursor-pointer items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b64f2]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

type FilterChipOption<T extends string> = {
  label: string;
  value: T;
};

type FilterChipGroupProps<T extends string> = {
  onChange: (value: T) => void;
  options: FilterChipOption<T>[];
  selectedValue: T;
};

function FilterChipGroup<T extends string>({
  onChange,
  options,
  selectedValue,
}: FilterChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`${filterChipClasses} ${
              selected
                ? 'border-blue-200 bg-blue-50 text-[#1b64f2]'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function FilterGroup({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
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

export function MarketplaceFilterBar({
  advancedFiltersOpen,
  availabilityOnly,
  budgetFilter,
  estimatedCpmFilter,
  onAdvancedFiltersToggle,
  onSearchChange,
  onSortChange,
  onTypeChange,
  onAvailabilityToggle,
  onBudgetFilterChange,
  onEstimatedCpmFilterChange,
  onVerifiedToggle,
  resultCount,
  search,
  sort,
  typeFilter,
  verifiedOnly,
}: MarketplaceFilterBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const activeAdvancedFilterCount =
    Number(typeFilter !== 'ALL') +
    Number(budgetFilter !== 'ALL') +
    Number(estimatedCpmFilter !== 'ALL') +
    Number(verifiedOnly);
  const advancedPanelId = 'marketplace-advanced-filters';

  const categoryOptions: FilterChipOption<AdSlotType | 'ALL'>[] = [
    { label: 'All categories', value: 'ALL' },
    { label: 'Display', value: 'DISPLAY' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Newsletter', value: 'NEWSLETTER' },
    { label: 'Podcast', value: 'PODCAST' },
    { label: 'Native', value: 'NATIVE' },
  ];
  const budgetOptions: FilterChipOption<BudgetFilter>[] = [
    { label: 'Any price', value: 'ALL' },
    { label: 'Under $2k', value: 'UNDER_2K' },
    { label: '$2k-$5k', value: 'BETWEEN_2K_AND_5K' },
    { label: '$5k+', value: 'OVER_5K' },
  ];
  const estimatedCpmOptions: FilterChipOption<EstimatedCpmFilter>[] = [
    { label: 'Any CPM', value: 'ALL' },
    { label: 'Under $10', value: 'UNDER_10' },
    { label: '$10-$25', value: 'BETWEEN_10_AND_25' },
    { label: '$25+', value: 'OVER_25' },
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

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] lg:flex lg:items-center">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={selectClasses}
            >
              <option value="price-desc">Price: High → Low</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="reach">Highest Reach</option>
            </select>

            <button
              type="button"
              onClick={onAdvancedFiltersToggle}
              aria-expanded={advancedFiltersOpen}
              aria-controls={advancedPanelId}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b64f2]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Advanced filters</span>
              {activeAdvancedFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-50 px-1.5 text-xs font-semibold text-[#1b64f2]">
                  {activeAdvancedFilterCount}
                </span>
              )}
              {advancedFiltersOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-[#1b64f2]">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {advancedFiltersOpen && (
            <motion.div
              id={advancedPanelId}
              key="advanced-filters"
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={shouldReduceMotion ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={shouldReduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
              }
              className="overflow-hidden"
            >
              <motion.div
                initial={shouldReduceMotion ? false : { y: -8, opacity: 0 }}
                animate={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                exit={shouldReduceMotion ? { y: 0, opacity: 0 } : { y: -8, opacity: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                }
                className="grid gap-5 border-t border-slate-200/80 pt-4 md:grid-cols-2 xl:grid-cols-4"
              >
                <FilterGroup icon={<Tag className="h-4 w-4" />} label="Categories">
                  <FilterChipGroup
                    selectedValue={typeFilter}
                    options={categoryOptions}
                    onChange={onTypeChange}
                  />
                </FilterGroup>

                <FilterGroup icon={<DollarSign className="h-4 w-4" />} label="Monthly slot price">
                  <FilterChipGroup
                    selectedValue={budgetFilter}
                    options={budgetOptions}
                    onChange={onBudgetFilterChange}
                  />
                </FilterGroup>

                <FilterGroup icon={<Gauge className="h-4 w-4" />} label="Estimated CPM">
                  <FilterChipGroup
                    selectedValue={estimatedCpmFilter}
                    options={estimatedCpmOptions}
                    onChange={onEstimatedCpmFilterChange}
                  />
                </FilterGroup>

                <FilterGroup icon={<BadgeCheck className="h-4 w-4" />} label="Listing checks">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onAvailabilityToggle}
                      className={`${filterChipClasses} ${
                        availabilityOnly
                          ? 'border-blue-200 bg-blue-50 text-[#1b64f2]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950'
                      }`}
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Available now
                    </button>

                    <button
                      type="button"
                      onClick={onVerifiedToggle}
                      className={`${filterChipClasses} ${
                        verifiedOnly
                          ? 'border-blue-200 bg-blue-50 text-[#1b64f2]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950'
                      }`}
                    >
                      <BadgeCheck className="mr-1.5 h-4 w-4" />
                      Verified publishers
                    </button>
                  </div>
                </FilterGroup>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
