'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authClient } from '@/auth-client';
import { GA_EVENTS, trackEvent } from '@/lib/analytics';
import type { RoleInfo } from '@/lib/types';

type UserRole = 'sponsor' | 'publisher' | null;
type ResolvedRole = { userId: string; role: UserRole } | null;

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [resolvedRole, setResolvedRole] = useState<ResolvedRole>(null);
  const role = user?.id && resolvedRole?.userId === user.id ? resolvedRole.role : null;

  function trackNavClick(destination: string): void {
    trackEvent(GA_EVENTS.NAV_CLICK, { destination });
  }

  // TODO: Convert to server component and fetch role server-side
  // Fetch user role from backend when user is logged in
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/profile`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setResolvedRole({ userId: user.id, role: (data as RoleInfo).role });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedRole({ userId: user.id, role: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // TODO: Add active link styling using usePathname() from next/navigation
  // The current page's link should be highlighted differently

  return (
    <header className="border-b border-[--color-border]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" onClick={() => trackNavClick('/')} className="text-xl font-bold text-[--color-primary]">
          Anvara
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/marketplace"
            onClick={() => trackNavClick('/marketplace')}
            className="text-[--color-muted] hover:text-[--color-foreground]"
          >
            Marketplace
          </Link>

          {user && role === 'sponsor' && (
            <Link
              href="/dashboard/sponsor"
              onClick={() => trackNavClick('/dashboard/sponsor')}
              className="text-[--color-muted] hover:text-[--color-foreground]"
            >
              My Campaigns
            </Link>
          )}
          {user && role === 'publisher' && (
            <Link
              href="/dashboard/publisher"
              onClick={() => trackNavClick('/dashboard/publisher')}
              className="text-[--color-muted] hover:text-[--color-foreground]"
            >
              My Ad Slots
            </Link>
          )}

          {isPending ? (
            <span className="text-[--color-muted]">...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[--color-muted]">
                {user.name} {role && `(${role})`}
              </span>
              <button
                onClick={async () => {
                  trackEvent(GA_EVENTS.LOGOUT);
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/';
                      },
                    },
                  });
                }}
                className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => trackNavClick('/login')}
              className="rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
