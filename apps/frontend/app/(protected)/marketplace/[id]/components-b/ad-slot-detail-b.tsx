'use client';

import { BarChart3, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ActionErrorNotice } from '@/app/components/action-error-notice';
import { homeBDisplayFont } from '@/app/home-b/fonts';
import { getABTestVariantLabel } from '@/lib/ab-testing';
import { adSlotEventParams, GA_EVENTS, trackEvent } from '@/lib/analytics';
import type { ActionState } from '@/lib/action-types';
import type { AdSlot, RoleInfo, SessionUser } from '@/lib/types';
import {
  formatAudienceSummary,
  formatEstimatedCpm,
  getAudienceSize,
  getTypeBadgeColor,
} from '../../variant-b/shared/format-helpers';
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
  const ctaFallbackLabel = 'Request booking';
  const ctaLabel = getABTestVariantLabel('cta-button-text', ctaVariant) ?? ctaFallbackLabel;
  const publisher = currentAdSlot.publisher;
  const placementCount = currentAdSlot._count?.placements ?? 0;
  const audienceSize = getAudienceSize(currentAdSlot);
  const estimatedCpm = formatEstimatedCpm(Number(currentAdSlot.basePrice), audienceSize);
  const summaryCards = [
    {
      icon: <Eye className="h-5 w-5 text-[#1b64f2]" />,
      label: 'Reach',
      value: audienceSize ? formatAudienceSummary(currentAdSlot.type, audienceSize) : 'Reach unavailable',
    },
    {
      icon: <Users className="h-5 w-5 text-violet-600" />,
      label: 'Audience',
      value: publisher?.category ? `${publisher.category} audience` : 'Publisher inventory',
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-emerald-600" />,
      label: estimatedCpm ? 'Estimated CPM' : 'Past demand',
      value: estimatedCpm
        ? `$${estimatedCpm}`
        : `Booked ${placementCount} time${placementCount === 1 ? '' : 's'}`,
    },
  ];

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
    <div className="theme-home-b min-h-screen pb-16 pt-24 sm:pt-28">
      <div className="space-y-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.35)] transition hover:border-slate-300 hover:text-slate-950"
        >
          <span aria-hidden="true">←</span>
          Back to Marketplace
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left column — content */}
          <div className="space-y-6">
          {/* Publisher profile */}
          {publisher && (
              <div className="rounded-[1.75rem] border border-white/80 bg-white/92 p-6 shadow-[0_26px_70px_-46px_rgba(15,23,42,0.32)]">
              <PublisherProfileB publisher={publisher} />
            </div>
          )}

          {/* Slot info */}
            <div className="rounded-[1.75rem] border border-white/80 bg-white/92 p-6 shadow-[0_26px_70px_-46px_rgba(15,23,42,0.32)] sm:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h1
                  className={`${homeBDisplayFont.className} max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl`}
                >
                  {currentAdSlot.name}
                </h1>
                <span
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-sm font-bold uppercase tracking-[0.18em] ${getTypeBadgeColor(
                    currentAdSlot.type
                  )}`}
                >
                  {currentAdSlot.type}
                </span>
              </div>

              {currentAdSlot.description && (
                <p className="max-w-3xl text-base leading-8 text-slate-600">{currentAdSlot.description}</p>
              )}

              {(currentAdSlot.width || currentAdSlot.height) && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                  <span>Dimensions:</span>
                  <span className="font-medium text-slate-950">
                    {currentAdSlot.width}×{currentAdSlot.height}px
                  </span>
                </div>
              )}
            </div>

          {/* Business summary */}
              <div className="grid gap-4 sm:grid-cols-3">
              {summaryCards.map((card) => (
                <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} />
              ))}
            </div>

          {/* Publisher bio */}
          {publisher?.bio && (
              <div className="rounded-[1.75rem] border border-white/80 bg-white/92 p-6 shadow-[0_26px_70px_-46px_rgba(15,23,42,0.32)]">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                About {publisher.name}
              </h3>
                <p className="text-sm leading-7 text-slate-600">{publisher.bio}</p>
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
                  ctaFallbackLabel={ctaFallbackLabel}
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
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-5 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.3)]">
      <div className="mb-3">{icon}</div>
      <p className="text-lg font-semibold leading-7 tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
    </div>
  );
}
