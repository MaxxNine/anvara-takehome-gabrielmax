'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { GA_EVENTS, trackEvent } from '@/lib/analytics';
import type { AdSlot, RoleInfo, SessionUser } from '@/lib/types';
import { AdSlotOverview } from './ad-slot-overview';
import { AdSlotStatusBar } from './ad-slot-status-bar';
import { PlacementRequestForm } from './placement-request-form';
import { PlacementSuccessNotice } from './placement-success-notice';
import { ResetListingButton } from './reset-listing-button';

const RECENT_AD_SLOT_VIEW_WINDOW_MS = 1000;
const recentAdSlotViews = new Map<string, number>();

function shouldTrackAdSlotView(slotId: string): boolean {
  const now = Date.now();
  const lastTrackedAt = recentAdSlotViews.get(slotId);

  recentAdSlotViews.set(slotId, now);

  for (const [trackedSlotId, trackedAt] of recentAdSlotViews) {
    if (now - trackedAt > RECENT_AD_SLOT_VIEW_WINDOW_MS) {
      recentAdSlotViews.delete(trackedSlotId);
    }
  }

  return lastTrackedAt === undefined || now - lastTrackedAt > RECENT_AD_SLOT_VIEW_WINDOW_MS;
}

type AdSlotDetailProps = {
  adSlot: AdSlot;
  roleInfo: RoleInfo | null;
  user: SessionUser | null;
};

export function AdSlotDetail({ adSlot, roleInfo, user }: AdSlotDetailProps) {
  const [currentAdSlot, setCurrentAdSlot] = useState(adSlot);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    // Deduplicate the extra development-only remount from React Strict Mode.
    if (shouldTrackAdSlotView(adSlot.id)) {
      trackEvent(GA_EVENTS.AD_SLOT_VIEW, {
        ad_slot_id: adSlot.id,
        ad_slot_type: adSlot.type,
        price: Number(adSlot.basePrice),
      });
    }
  }, [adSlot.basePrice, adSlot.id, adSlot.type]);

  function handleBooked(): void {
    setBookingSuccess(true);
    setResetError(null);
    setCurrentAdSlot((slot) => ({ ...slot, isAvailable: false }));
  }

  function handleReset(): void {
    setBookingSuccess(false);
    setResetError(null);
    setCurrentAdSlot((slot) => ({ ...slot, isAvailable: true }));
  }

  const companyName = roleInfo?.name || user?.name || 'Unknown sponsor';
  const canRequestPlacement = roleInfo?.role === 'sponsor' && Boolean(roleInfo.sponsorId);
  const canResetListing =
    roleInfo?.role === 'publisher' && roleInfo.publisherId === currentAdSlot.publisherId;

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="text-[--color-primary] hover:underline">
        ← Back to Marketplace
      </Link>

      <div className="rounded-lg border border-[--color-border] p-6">
        <AdSlotOverview adSlot={currentAdSlot} />

        <AdSlotStatusBar
          adSlot={currentAdSlot}
          bookingSuccess={bookingSuccess}
          resetControl={
            canResetListing ? (
              <ResetListingButton
                adSlotId={currentAdSlot.id}
                label="Reset listing"
                pendingLabel="Resetting..."
                className="ml-3 text-sm text-[--color-primary] underline hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                onErrorChange={setResetError}
                onResetSuccess={handleReset}
              />
            ) : undefined
          }
        />

        {resetError ? <p className="mt-3 text-sm text-red-600">{resetError}</p> : null}

        {currentAdSlot.isAvailable && !bookingSuccess ? (
          <div className="mt-6 border-t border-[--color-border] pt-6">
            <h2 className="mb-4 text-lg font-semibold">Request This Placement</h2>

            {canRequestPlacement ? (
              <PlacementRequestForm
                adSlotId={currentAdSlot.id}
                companyName={companyName}
                onBooked={handleBooked}
              />
            ) : (
              <div>
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 font-semibold text-gray-500"
                >
                  Request This Placement
                </button>
                <p className="mt-2 text-center text-sm text-[--color-muted]">
                  {user
                    ? 'Only sponsors can request placements'
                    : 'Log in as a sponsor to request this placement'}
                </p>
              </div>
            )}
          </div>
        ) : null}

        {bookingSuccess ? (
          <PlacementSuccessNotice
            resetControl={
              canResetListing ? (
                <ResetListingButton
                  adSlotId={currentAdSlot.id}
                  label="Remove Booking (reset for testing)"
                  pendingLabel="Resetting..."
                  className="mt-3 text-sm text-green-700 underline hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  onErrorChange={setResetError}
                  onResetSuccess={handleReset}
                />
              ) : undefined
            }
          />
        ) : null}
      </div>
    </div>
  );
}
