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
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_30px_80px_-44px_rgba(15,23,42,0.34)]">
      {/* Price */}
      <div className="mb-1">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1b64f2]/70">
          Booking summary
        </p>
        <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          ${price.toLocaleString()}
        </p>
        <p className="text-sm text-slate-500">per month</p>
      </div>

      {/* Cost per 1K views */}
      {costPer1K && (
        <p className="mb-5 text-sm text-slate-600">
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
            <span className="text-sm font-semibold text-emerald-600">Available now</span>
          </>
        ) : (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            <span className="text-sm font-semibold text-slate-500">Currently booked</span>
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
      <div className="mb-5 border-t border-slate-200" />

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
              className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-500"
            >
              {ctaLabel}
            </button>
            {disabledMessage && (
              <p className="mt-2 text-center text-sm text-slate-500">{disabledMessage}</p>
            )}
          </div>
        )
      ) : null}

      {/* Trust signals */}
      <div className="mt-5 border-t border-slate-200 pt-5">
        <TrustSignalsB isVerified={adSlot.publisher?.isVerified} />
      </div>
    </div>
  );
}
