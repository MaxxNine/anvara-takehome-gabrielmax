'use client';

import Link from 'next/link';
import { GA_EVENTS, trackEvent } from '@/lib/analytics';

export function HomeCtaLink() {
  function handleClick(): void {
    trackEvent(GA_EVENTS.CTA_CLICK, {
      location: 'home_hero',
      label: 'get_started',
    });
  }

  return (
    <Link
      href="/login"
      onClick={handleClick}
      className="rounded-lg bg-[--color-primary] px-6 py-3 text-white hover:bg-[--color-primary-hover]"
    >
      Get Started
    </Link>
  );
}
