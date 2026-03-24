'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import {
  type AnalyticsEventMap,
  type AnalyticsEventName,
  trackEventAndRun,
} from '@/lib/analytics';

type TrackedLinkProps<K extends AnalyticsEventName> = {
  children: ReactNode;
  className?: string;
  eventName: K;
  eventParams: AnalyticsEventMap[K];
  href: string;
  prefetchOnIntent?: boolean;
  timeout?: number;
};

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

export function TrackedLink<K extends AnalyticsEventName>({
  children,
  className,
  eventName,
  eventParams,
  href,
  prefetchOnIntent = true,
  timeout,
}: TrackedLinkProps<K>) {
  const router = useRouter();

  async function handleTrackedNavigation(): Promise<void> {
    await trackEventAndRun(eventName, () => router.push(href), eventParams, timeout);
  }

  function handlePrefetch(): void {
    if (!prefetchOnIntent) {
      return;
    }

    router.prefetch(href);
  }

  async function handleClick(event: MouseEvent<HTMLAnchorElement>): Promise<void> {
    if (!shouldHandleClientNavigation(event)) {
      return;
    }

    event.preventDefault();
    await handleTrackedNavigation();
  }

  return (
    <a
      href={href}
      onClick={(event) => void handleClick(event)}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      className={className}
    >
      {children}
    </a>
  );
}
