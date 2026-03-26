'use client';

import { TrackedLink } from '@/app/components/tracked-link';
import { GA_EVENTS } from '@/lib/analytics';

type HomeBCtaLinkProps = {
  children: React.ReactNode;
  href: string;
  label: string;
  location: string;
  variant?: 'primary' | 'secondary';
};

export function HomeBCtaLink({
  children,
  href,
  label,
  location,
  variant = 'primary',
}: HomeBCtaLinkProps) {
  const className =
    variant === 'primary'
      ? 'inline-flex w-full items-center justify-center rounded-full bg-[--color-primary] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[--color-primary-hover] sm:w-auto sm:px-6 sm:py-3.5'
      : 'inline-flex w-full items-center justify-center rounded-full border border-[--color-border] bg-white px-5 py-3 text-sm font-semibold text-[--color-foreground] transition hover:border-[--color-primary] hover:text-[--color-primary] sm:w-auto sm:px-6 sm:py-3.5';

  return (
    <TrackedLink
      href={href}
      className={className}
      eventName={GA_EVENTS.CTA_CLICK}
      eventParams={{
        label,
        location,
      }}
      timeout={500}
    >
      {children}
    </TrackedLink>
  );
}
