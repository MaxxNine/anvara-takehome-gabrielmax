'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { GA_EVENTS, trackEvent } from '@/lib/analytics';
import type { AdSlot, RoleInfo, SessionUser } from '@/lib/types';
import { AdSlotOverview } from './ad-slot-overview';
import { AdSlotStatusBar } from './ad-slot-status-bar';
import { PlacementRequestForm } from './placement-request-form';
import { PlacementSuccessNotice } from './placement-success-notice';

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

  async function handleUnbook(): Promise<void> {
    setResetError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${currentAdSlot.id}/unbook`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to reset booking');
      }

      setBookingSuccess(false);
      setCurrentAdSlot((slot) => ({ ...slot, isAvailable: true }));
    } catch (error) {
      setResetError(error instanceof Error ? error.message : 'Failed to reset booking');
    }
  }

  function handleBooked(): void {
    setBookingSuccess(true);
    setResetError(null);
    setCurrentAdSlot((slot) => ({ ...slot, isAvailable: false }));
  }

  const companyName = roleInfo?.name || user?.name || 'Unknown sponsor';
  const canRequestPlacement = roleInfo?.role === 'sponsor' && Boolean(roleInfo.sponsorId);

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
          onReset={() => void handleUnbook()}
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
          <PlacementSuccessNotice onReset={() => void handleUnbook()} />
        ) : null}
      </div>
    </div>
  );
}
