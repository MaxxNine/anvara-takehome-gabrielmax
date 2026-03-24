'use client';

import type { ReactNode } from 'react';

import { GA_EVENTS } from '@/lib/analytics';
import type { AdSlotType } from '@/lib/types';
import { TrackedLink } from '@/app/components/tracked-link';

type AdSlotCardLinkProps = {
  children: ReactNode;
  className: string;
  slotId: string;
  slotName: string;
  slotType: AdSlotType;
};

export function AdSlotCardLink({
  children,
  className,
  slotId,
  slotName,
  slotType,
}: AdSlotCardLinkProps) {
  return (
    <TrackedLink
      href={`/marketplace/${slotId}`}
      className={className}
      eventName={GA_EVENTS.AD_SLOT_CLICK}
      eventParams={{
        ad_slot_id: slotId,
        ad_slot_type: slotType,
        ad_slot_name: slotName,
      }}
      timeout={500}
    >
      {children}
    </TrackedLink>
  );
}
