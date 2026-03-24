'use client';

import type { ReactNode } from 'react';

import { TrackedLink } from '@/app/components/tracked-link';
import { GA_EVENTS, type AnalyticsEventMap } from '@/lib/analytics';

type AdSlotCardLinkProps = {
  children: ReactNode;
  className: string;
  eventParams: AnalyticsEventMap[typeof GA_EVENTS.AD_SLOT_CLICK];
  slotId: string;
};

export function AdSlotCardLink({ children, className, eventParams, slotId }: AdSlotCardLinkProps) {
  return (
    <TrackedLink
      href={`/marketplace/${slotId}`}
      className={className}
      eventName={GA_EVENTS.AD_SLOT_CLICK}
      eventParams={eventParams}
      timeout={500}
    >
      {children}
    </TrackedLink>
  );
}
