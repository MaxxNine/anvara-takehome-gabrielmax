'use client';

import { GA_EVENTS } from '@/lib/analytics';
import { TrackedLink } from './tracked-link';

export function HomeCtaLink() {
  return (
    <TrackedLink
      href="/login"
      className="rounded-lg bg-[--color-primary] px-6 py-3 text-white hover:bg-[--color-primary-hover]"
      eventName={GA_EVENTS.CTA_CLICK}
      eventParams={{
        location: 'home_hero',
        label: 'get_started',
      }}
    >
      Get Started
    </TrackedLink>
  );
}
