import { headers } from 'next/headers';

import { auth } from '@/auth';
import { getCurrentUserProfile } from '@/lib/auth-helpers';
import { getServerABVariant } from '@/lib/ab-testing/server';
import type { UserRole } from '@/lib/types';
import { NavVariantA } from './nav-variant-a';
import { NavVariantB } from './nav-variant-b';

export type NavUser = {
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

  if (homeVariant === 'B') {
    return <NavVariantB user={user} role={role} />;
  }

  return <NavVariantA user={user} role={role} />;
}
