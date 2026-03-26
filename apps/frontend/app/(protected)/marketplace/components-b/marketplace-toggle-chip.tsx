'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type MarketplaceToggleChipProps = {
  children: ReactNode;
  icon?: ReactNode;
  onClick: () => void;
  pressed: boolean;
};

const filterChipClasses =
  'inline-flex cursor-pointer items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b64f2]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

export function MarketplaceToggleChip({
  children,
  icon,
  onClick,
  pressed,
}: MarketplaceToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        filterChipClasses,
        pressed
          ? 'border-blue-200 bg-blue-50 text-[#1b64f2]'
          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950'
      )}
    >
      {icon ? <span className="mr-1.5">{icon}</span> : null}
      {children}
    </button>
  );
}
