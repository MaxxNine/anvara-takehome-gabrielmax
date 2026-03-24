'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { GA_EVENTS, trackEvent } from '@/lib/analytics';
import type { AdSlot, RoleInfo, SessionUser } from '@/lib/types';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

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
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

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

  async function handleBooking(): Promise<void> {
    if (!roleInfo?.sponsorId) {
      return;
    }

    trackEvent(GA_EVENTS.PLACEMENT_REQUEST, { ad_slot_id: currentAdSlot.id });
    setBooking(true);
    setBookingError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${currentAdSlot.id}/book`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book placement');
      }

      trackEvent(GA_EVENTS.PLACEMENT_SUCCESS, { ad_slot_id: currentAdSlot.id });
      setBookingSuccess(true);
      setCurrentAdSlot((slot) => ({ ...slot, isAvailable: false }));
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Failed to book placement');
    } finally {
      setBooking(false);
    }
  }

  async function handleUnbook(): Promise<void> {
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
        throw new Error('Failed to reset booking');
      }

      setBookingSuccess(false);
      setCurrentAdSlot((slot) => ({ ...slot, isAvailable: true }));
      setMessage('');
    } catch (error) {
      console.error('Failed to unbook:', error);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="text-[--color-primary] hover:underline">
        ← Back to Marketplace
      </Link>

      <div className="rounded-lg border border-[--color-border] p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentAdSlot.name}</h1>
            {currentAdSlot.publisher ? (
              <p className="text-[--color-muted]">
                by {currentAdSlot.publisher.name}
                {currentAdSlot.publisher.website ? (
                  <>
                    {' '}
                    ·{' '}
                    <a
                      href={currentAdSlot.publisher.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[--color-primary] hover:underline"
                    >
                      {currentAdSlot.publisher.website}
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
          <span
            className={`rounded px-3 py-1 text-sm ${typeColors[currentAdSlot.type] || 'bg-gray-100'}`}
          >
            {currentAdSlot.type}
          </span>
        </div>

        {currentAdSlot.description ? (
          <p className="mb-6 text-[--color-muted]">{currentAdSlot.description}</p>
        ) : null}

        <div className="flex items-center justify-between border-t border-[--color-border] pt-4">
          <div>
            <span
              className={`text-sm font-medium ${currentAdSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
            >
              {currentAdSlot.isAvailable ? '● Available' : '○ Currently Booked'}
            </span>
            {!currentAdSlot.isAvailable && !bookingSuccess ? (
              <button
                onClick={() => void handleUnbook()}
                className="ml-3 text-sm text-[--color-primary] underline hover:opacity-80"
              >
                Reset listing
              </button>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[--color-primary]">
              ${Number(currentAdSlot.basePrice).toLocaleString()}
            </p>
            <p className="text-sm text-[--color-muted]">per month</p>
          </div>
        </div>

        {currentAdSlot.isAvailable && !bookingSuccess ? (
          <div className="mt-6 border-t border-[--color-border] pt-6">
            <h2 className="mb-4 text-lg font-semibold">Request This Placement</h2>

            {roleInfo?.role === 'sponsor' && roleInfo.sponsorId ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[--color-muted]">
                    Your Company
                  </label>
                  <p className="text-[--color-foreground]">{roleInfo.name || user?.name}</p>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium text-[--color-muted]"
                  >
                    Message to Publisher (optional)
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell the publisher about your campaign goals..."
                    className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-[--color-foreground] placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                    rows={3}
                  />
                </div>
                {bookingError ? <p className="text-sm text-red-600">{bookingError}</p> : null}
                <button
                  onClick={() => void handleBooking()}
                  disabled={booking}
                  className="w-full rounded-lg bg-[--color-primary] px-4 py-3 font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
                >
                  {booking ? 'Booking...' : 'Book This Placement'}
                </button>
              </div>
            ) : (
              <div>
                <button
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
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-800">Placement Booked!</h3>
            <p className="mt-1 text-sm text-green-700">
              Your request has been submitted. The publisher will be in touch soon.
            </p>
            <button
              onClick={() => void handleUnbook()}
              className="mt-3 text-sm text-green-700 underline hover:text-green-800"
            >
              Remove Booking (reset for testing)
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
