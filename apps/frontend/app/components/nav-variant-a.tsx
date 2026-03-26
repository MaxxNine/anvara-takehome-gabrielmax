import type { UserRole } from '@/lib/types';
import type { NavUser } from './nav';
import { LogoutButton } from './logout-button';
import { TrackedNavLink } from './tracked-nav-link';

type NavVariantAProps = {
  role: UserRole | null;
  user: NavUser;
};

export function NavVariantA({ user, role }: NavVariantAProps) {
  return (
    <header className="border-b border-[--color-border]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <TrackedNavLink
          href="/"
          destination="/"
          className="text-xl font-bold text-[--color-primary]"
        >
          Anvara
        </TrackedNavLink>

        <div className="flex items-center gap-6">
          <TrackedNavLink
            href="/marketplace"
            destination="/marketplace"
            className="text-[--color-muted] hover:text-[--color-foreground]"
          >
            Marketplace
          </TrackedNavLink>

          {user && role === 'sponsor' ? (
            <TrackedNavLink
              href="/dashboard/sponsor"
              destination="/dashboard/sponsor"
              className="text-[--color-muted] hover:text-[--color-foreground]"
            >
              My Campaigns
            </TrackedNavLink>
          ) : null}
          {user && role === 'publisher' ? (
            <TrackedNavLink
              href="/dashboard/publisher"
              destination="/dashboard/publisher"
              className="text-[--color-muted] hover:text-[--color-foreground]"
            >
              My Ad Slots
            </TrackedNavLink>
          ) : null}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[--color-muted]">
                {user.name} {role ? `(${role})` : null}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <TrackedNavLink
              href="/login"
              destination="/login"
              className="rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
            >
              Login
            </TrackedNavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
