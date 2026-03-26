'use client';

import { cn } from '@/lib/utils';

import type { FilterChipOption } from '../model/constants';

type MarketplaceChipGroupProps<T extends string> = {
  onChange: (value: T) => void;
  options: FilterChipOption<T>[];
  selectedValue: T;
};

const filterChipClasses =
  'inline-flex cursor-pointer items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b64f2]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

export function MarketplaceChipGroup<T extends string>({
  onChange,
  options,
  selectedValue,
}: MarketplaceChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              filterChipClasses,
              selected
                ? 'border-blue-200 bg-blue-50 text-[#1b64f2]'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
