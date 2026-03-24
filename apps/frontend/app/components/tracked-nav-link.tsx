'use client';

import type { ReactNode } from 'react';

import { GA_EVENTS } from '@/lib/analytics';
import { TrackedLink } from './tracked-link';

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
  return (
    <TrackedLink
      href={href}
      className={className}
      eventName={GA_EVENTS.NAV_CLICK}
      eventParams={{ destination }}
    >
      {children}
    </TrackedLink>
  );
}
