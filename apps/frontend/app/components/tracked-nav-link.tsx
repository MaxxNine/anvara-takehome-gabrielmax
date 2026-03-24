'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import { GA_EVENTS, trackEvent } from '@/lib/analytics';

type TrackedNavLinkProps = {
  children: ReactNode;
  className: string;
  destination: string;
  href: string;
};

export function TrackedNavLink({
  children,
  className,
  destination,
  href,
}: TrackedNavLinkProps) {
  function handleClick(): void {
    trackEvent(GA_EVENTS.NAV_CLICK, { destination });
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
