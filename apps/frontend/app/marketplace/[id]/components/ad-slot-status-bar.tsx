import type { ReactNode } from 'react';

import type { AdSlot } from '@/lib/types';

type AdSlotStatusBarProps = {
  adSlot: AdSlot;
  bookingSuccess: boolean;
  resetControl?: ReactNode;
};

export function AdSlotStatusBar({
  adSlot,
  bookingSuccess,
  resetControl,
}: AdSlotStatusBarProps) {
  return (
    <div className="flex items-center justify-between border-t border-[--color-border] pt-4">
      <div>
        <span
          className={`text-sm font-medium ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
        >
          {adSlot.isAvailable ? '● Available' : '○ Currently Booked'}
        </span>
        {!adSlot.isAvailable && !bookingSuccess ? resetControl : null}
      </div>

      <div className="text-right">
        <p className="text-2xl font-bold text-[--color-primary]">
          ${Number(adSlot.basePrice).toLocaleString()}
        </p>
        <p className="text-sm text-[--color-muted]">per month</p>
      </div>
    </div>
  );
}
