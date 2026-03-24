import type { AdSlot } from '@/lib/types';

type AdSlotStatusBarProps = {
  adSlot: AdSlot;
  bookingSuccess: boolean;
  onReset: () => void;
};

export function AdSlotStatusBar({ adSlot, bookingSuccess, onReset }: AdSlotStatusBarProps) {
  return (
    <div className="flex items-center justify-between border-t border-[--color-border] pt-4">
      <div>
        <span
          className={`text-sm font-medium ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
        >
          {adSlot.isAvailable ? '● Available' : '○ Currently Booked'}
        </span>
        {!adSlot.isAvailable && !bookingSuccess ? (
          <button
            type="button"
            onClick={onReset}
            className="ml-3 text-sm text-[--color-primary] underline hover:opacity-80"
          >
            Reset listing
          </button>
        ) : null}
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
