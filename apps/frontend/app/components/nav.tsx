import { headers } from 'next/headers';

import { auth } from '@/auth';
import { getCurrentUserProfile } from '@/lib/auth-helpers';
import { getServerABVariant } from '@/lib/ab-testing/server';
import type { UserRole } from '@/lib/types';
import { LogoutButton } from './logout-button';
import { TrackedNavLink } from './tracked-nav-link';

type NavUser = {
  name: string;
  role: UserRole | null;
} | null;

async function getNavUser(): Promise<NavUser> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return null;
  }

  try {
    const profile = await getCurrentUserProfile(requestHeaders);

    return {
      name: session.user.name,
      role: profile.role,
    };
  } catch {
    return {
      name: session.user.name,
      role: null,
    };
  }
}

export async function Nav() {
  const user = await getNavUser();
  const role = user?.role ?? null;
  const homeVariant = await getServerABVariant('home-hero-layout');
  const isVariantB = homeVariant === 'B';

  return (
    <header
      className={
        isVariantB
          ? 'border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/78'
          : 'border-b border-[--color-border]'
      }
    >
      <nav
        className={`mx-auto flex items-center justify-between px-4 py-4 ${
          isVariantB ? 'max-w-7xl sm:px-6' : 'max-w-6xl'
        }`}
      >
        <TrackedNavLink
          href="/"
          destination="/"
          className={
            isVariantB
              ? 'text-xl font-bold tracking-tight text-slate-950'
              : 'text-xl font-bold text-[--color-primary]'
          }
        >
          Anvara
        </TrackedNavLink>

        <div className="flex items-center gap-6">
          <TrackedNavLink
            href="/marketplace"
            destination="/marketplace"
            className={
              isVariantB
                ? 'text-sm font-medium text-slate-600 transition hover:text-slate-950'
                : 'text-[--color-muted] hover:text-[--color-foreground]'
            }
          >
            Marketplace
          </TrackedNavLink>

          {user && role === 'sponsor' ? (
            <TrackedNavLink
              href="/dashboard/sponsor"
              destination="/dashboard/sponsor"
              className={
                isVariantB
                  ? 'text-sm font-medium text-slate-600 transition hover:text-slate-950'
                  : 'text-[--color-muted] hover:text-[--color-foreground]'
              }
            >
              My Campaigns
            </TrackedNavLink>
          ) : null}
          {user && role === 'publisher' ? (
            <TrackedNavLink
              href="/dashboard/publisher"
              destination="/dashboard/publisher"
              className={
                isVariantB
                  ? 'text-sm font-medium text-slate-600 transition hover:text-slate-950'
                  : 'text-[--color-muted] hover:text-[--color-foreground]'
              }
            >
              My Ad Slots
            </TrackedNavLink>
          ) : null}

          {user ? (
            <div className="flex items-center gap-4">
              <span className={isVariantB ? 'text-sm text-slate-500' : 'text-sm text-[--color-muted]'}>
                {user.name} {role ? `(${role})` : null}
              </span>
              <LogoutButton
                className={
                  isVariantB
                    ? 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70'
                    : undefined
                }
              />
            </div>
          ) : (
            <TrackedNavLink
              href="/login"
              destination="/login"
              className={
                isVariantB
                  ? 'rounded-full bg-[#1b64f2] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(27,100,242,0.8)] transition hover:bg-blue-600'
                  : 'rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]'
              }
            >
              Login
            </TrackedNavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
