'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { GA_EVENTS, trackEventAndWait } from '@/lib/analytics';
import type { AdSlotType } from '@/lib/types';

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
  const router = useRouter();
  const href = `/marketplace/${slotId}`;

  async function handleAdSlotNavigation(): Promise<void> {
    await trackEventAndWait(
      GA_EVENTS.AD_SLOT_CLICK,
      {
        ad_slot_id: slotId,
        ad_slot_type: slotType,
        ad_slot_name: slotName,
      },
      500
    );

    router.push(href);
  }

  function prefetchAdSlot(): void {
    router.prefetch(href);
  }

  function shouldHandleClientNavigation(event: MouseEvent<HTMLAnchorElement>): boolean {
    return (
      event.button === 0 &&
      !event.defaultPrevented &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    );
  }

  async function handleClick(event: MouseEvent<HTMLAnchorElement>): Promise<void> {
    if (!shouldHandleClientNavigation(event)) {
      return;
    }

    event.preventDefault();
    await handleAdSlotNavigation();
  }

  return (
    <a
      href={href}
      onClick={(event) => void handleClick(event)}
      onMouseEnter={prefetchAdSlot}
      onFocus={prefetchAdSlot}
      className={className}
    >
      {children}
    </a>
  );
}
