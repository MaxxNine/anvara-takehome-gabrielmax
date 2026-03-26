import type { ReactNode } from 'react';

import type { AdSlot } from '@/lib/types';
import { TrustSignalsB } from './trust-signals-b';
import { UrgencySignalsB } from './urgency-signals-b';

type BookingSidebarBProps = {
  adSlot: AdSlot;
  bookingForm: ReactNode;
  canRequestPlacement: boolean;
  ctaLabel: string;
  disabledMessage?: string;
  successNotice?: ReactNode;
};

export function BookingSidebarB({
  adSlot,
  bookingForm,
  canRequestPlacement,
  ctaLabel,
  disabledMessage,
  successNotice,
}: BookingSidebarBProps) {
  const price = Number(adSlot.basePrice);
  const monthlyViews = adSlot.publisher?.monthlyViews;
  const costPer1K = monthlyViews ? ((price / monthlyViews) * 1000).toFixed(2) : null;
  const placementCount = adSlot._count?.placements ?? 0;

  return (
    <div className="rounded-xl border border-[--color-border] bg-[--color-background] p-6">
      {/* Price */}
      <div className="mb-1">
        <p className="text-3xl font-bold text-[--color-foreground]">
          ${price.toLocaleString()}
        </p>
        <p className="text-sm text-[--color-muted]">per month</p>
      </div>

      {/* Cost per 1K views */}
      {costPer1K && (
        <p className="mb-4 text-xs text-[--color-muted]">
          ≈ ${costPer1K} per 1,000 {adSlot.type === 'PODCAST' ? 'listeners' : 'views'}
        </p>
      )}

      {/* Availability */}
      <div className="mb-5 flex items-center gap-2">
        {adSlot.isAvailable ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-emerald-400">Available now</span>
          </>
        ) : (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-[--color-muted]" />
            <span className="text-sm font-medium text-[--color-muted]">Currently booked</span>
          </>
        )}
      </div>

      {/* Urgency signals */}
      <div className="mb-5">
        <UrgencySignalsB
          placementCount={placementCount}
          monthlyViews={monthlyViews}
        />
      </div>

      {/* Divider */}
      <div className="mb-5 border-t border-[--color-border]" />

      {/* Booking form or disabled state or success */}
      {successNotice ? (
        successNotice
      ) : adSlot.isAvailable ? (
        canRequestPlacement ? (
          bookingForm
        ) : (
          <div>
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 font-semibold text-gray-500"
            >
              {ctaLabel}
            </button>
            {disabledMessage && (
              <p className="mt-2 text-center text-sm text-[--color-muted]">{disabledMessage}</p>
            )}
          </div>
        )
      ) : null}

      {/* Trust signals */}
      <div className="mt-5 border-t border-[--color-border] pt-5">
        <TrustSignalsB isVerified={adSlot.publisher?.isVerified} />
      </div>
    </div>
  );
}
