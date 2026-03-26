'use client';

import { BarChart3, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ActionErrorNotice } from '@/app/components/action-error-notice';
import { getABTestVariantLabel } from '@/lib/ab-testing';
import { adSlotEventParams, GA_EVENTS, trackEvent } from '@/lib/analytics';
import type { ActionState } from '@/lib/action-types';
import type { AdSlot, RoleInfo, SessionUser } from '@/lib/types';
import { formatReach, getTypeBadgeColor } from '../../components-b/format-helpers';
import { PlacementRequestForm } from '../components/placement-request-form';
import { PlacementSuccessNotice } from '../components/placement-success-notice';
import { ResetListingButton } from '../components/reset-listing-button';
import { BookingSidebarB } from './booking-sidebar-b';
import { PublisherProfileB } from './publisher-profile-b';
import { RelatedListingsB } from './related-listings-b';

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

type AdSlotDetailBProps = {
  adSlot: AdSlot;
  ctaVariant: string;
  relatedSlots: AdSlot[];
  roleInfo: RoleInfo | null;
  user: SessionUser | null;
};

export function AdSlotDetailB({ adSlot, ctaVariant, relatedSlots, roleInfo, user }: AdSlotDetailBProps) {
  const [currentAdSlot, setCurrentAdSlot] = useState(adSlot);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [resetError, setResetError] = useState<ActionState | null>(null);

  useEffect(() => {
    if (shouldTrackAdSlotView(adSlot.id)) {
      trackEvent(GA_EVENTS.AD_SLOT_VIEW, {
        ...adSlotEventParams(adSlot),
        conversion_type: 'micro',
      });
    }
  }, [adSlot]);

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
  const ctaLabel = getABTestVariantLabel('cta-button-text', ctaVariant) ?? 'Book This Placement';
  const publisher = currentAdSlot.publisher;
  const placementCount = currentAdSlot._count?.placements ?? 0;

  const resetControl = canResetListing ? (
    <ResetListingButton
      adSlotId={currentAdSlot.id}
      label="Reset listing"
      pendingLabel="Resetting..."
      className="ml-3 text-sm text-[--color-primary] underline hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      onErrorChange={setResetError}
      onResetSuccess={handleReset}
    />
  ) : undefined;

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-[--color-primary] hover:underline">
        ← Back to Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column — content */}
        <div className="space-y-6">
          {/* Publisher profile */}
          {publisher && (
            <div className="rounded-xl border border-[--color-border] p-5">
              <PublisherProfileB publisher={publisher} />
            </div>
          )}

          {/* Slot info */}
          <div className="rounded-xl border border-[--color-border] p-6">
            <div className="mb-4 flex items-start justify-between">
              <h1 className="text-2xl font-bold text-[--color-foreground]">{currentAdSlot.name}</h1>
              <span className={`flex-shrink-0 rounded-md px-3 py-1 text-sm font-bold ${getTypeBadgeColor(currentAdSlot.type)}`}>
                {currentAdSlot.type}
              </span>
            </div>

            {currentAdSlot.description && (
              <p className="text-[--color-muted] leading-relaxed">{currentAdSlot.description}</p>
            )}

            {/* Dimensions if available */}
            {(currentAdSlot.width || currentAdSlot.height) && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-[--color-muted]">
                <span>Dimensions:</span>
                <span className="font-medium text-[--color-foreground]">
                  {currentAdSlot.width}×{currentAdSlot.height}px
                </span>
              </div>
            )}
          </div>

          {/* Publisher stats */}
          {publisher && (
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<Eye className="h-5 w-5 text-blue-400" />}
                label="Monthly Reach"
                value={publisher.monthlyViews ? formatReach(publisher.monthlyViews) : '—'}
              />
              <StatCard
                icon={<Users className="h-5 w-5 text-purple-400" />}
                label="Subscribers"
                value={publisher.subscriberCount ? formatReach(publisher.subscriberCount) : '—'}
              />
              <StatCard
                icon={<BarChart3 className="h-5 w-5 text-emerald-400" />}
                label="Past Bookings"
                value={String(placementCount)}
              />
            </div>
          )}

          {/* Publisher bio */}
          {publisher?.bio && (
            <div className="rounded-xl border border-[--color-border] p-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[--color-muted]">
                About {publisher.name}
              </h3>
              <p className="text-sm leading-relaxed text-[--color-muted]">{publisher.bio}</p>
            </div>
          )}

          {/* Reset error */}
          {resetError && (
            <div className="mt-3">
              <ActionErrorNotice state={resetError} />
            </div>
          )}

          {/* Related listings */}
          <RelatedListingsB listings={relatedSlots} />
        </div>

        {/* Right column — booking sidebar (sticky) */}
        <div className="lg:self-start lg:sticky lg:top-24">
          <BookingSidebarB
            adSlot={currentAdSlot}
            canRequestPlacement={canRequestPlacement}
            ctaLabel={ctaLabel}
            disabledMessage={
              user
                ? 'Only sponsors can request placements'
                : 'Log in as a sponsor to request this placement'
            }
            bookingForm={
              <PlacementRequestForm
                adSlot={currentAdSlot}
                companyName={companyName}
                initialCtaVariant={ctaVariant}
                onBooked={handleBooked}
              />
            }
            successNotice={
              bookingSuccess ? (
                <PlacementSuccessNotice resetControl={resetControl} />
              ) : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[--color-border] p-4">
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold text-[--color-foreground]">{value}</p>
      <p className="text-xs text-[--color-muted]">{label}</p>
    </div>
  );
}
