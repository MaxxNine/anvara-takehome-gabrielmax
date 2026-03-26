'use client';

import { useEffect, useState } from 'react';

import type { UserRole } from '@/lib/types';
import type { NavUser } from './nav';
import { LogoutButton } from './logout-button';
import { TrackedNavLink } from './tracked-nav-link';

type NavVariantBProps = {
  role: UserRole | null;
  user: NavUser;
};

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 8h16" />
          <path d="M4 16h16" />
        </>
      )}
    </svg>
  );
}

export function NavVariantB({ user, role }: NavVariantBProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hasBg = scrolled || menuOpen;

  const linkClass = `text-sm font-medium transition-colors duration-300 ${
    hasBg ? 'text-slate-600 hover:text-slate-950' : 'text-white/80 hover:text-white'
  }`;

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasBg
          ? 'border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/78'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <TrackedNavLink
          href="/"
          destination="/"
          className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
            hasBg ? 'text-slate-950' : 'text-white'
          }`}
        >
          Anvara
        </TrackedNavLink>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          <TrackedNavLink href="/marketplace" destination="/marketplace" className={linkClass}>
            Marketplace
          </TrackedNavLink>

          {user && role === 'sponsor' ? (
            <TrackedNavLink
              href="/dashboard/sponsor"
              destination="/dashboard/sponsor"
              className={linkClass}
            >
              My Campaigns
            </TrackedNavLink>
          ) : null}
          {user && role === 'publisher' ? (
            <TrackedNavLink
              href="/dashboard/publisher"
              destination="/dashboard/publisher"
              className={linkClass}
            >
              My Ad Slots
            </TrackedNavLink>
          ) : null}

          {user ? (
            <div className="flex items-center gap-4">
              <span
                className={`text-sm transition-colors duration-300 ${
                  hasBg ? 'text-slate-500' : 'text-white/60'
                }`}
              >
                {user.name} {role ? `(${role})` : null}
              </span>
              <LogoutButton
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
                  hasBg
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950'
                    : 'border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                }`}
              />
            </div>
          ) : (
            <TrackedNavLink
              href="/login"
              destination="/login"
              className="rounded-full bg-[#1b64f2] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(27,100,242,0.8)] transition hover:bg-blue-600"
            >
              Login
            </TrackedNavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`md:hidden transition-colors duration-300 ${
            hasBg ? 'text-slate-700' : 'text-white'
          }`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-slate-200/50 px-4 pb-6 pt-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <TrackedNavLink
              href="/marketplace"
              destination="/marketplace"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              <span onClick={closeMenu}>Marketplace</span>
            </TrackedNavLink>

            {user && role === 'sponsor' ? (
              <TrackedNavLink
                href="/dashboard/sponsor"
                destination="/dashboard/sponsor"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                <span onClick={closeMenu}>My Campaigns</span>
              </TrackedNavLink>
            ) : null}
            {user && role === 'publisher' ? (
              <TrackedNavLink
                href="/dashboard/publisher"
                destination="/dashboard/publisher"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                <span onClick={closeMenu}>My Ad Slots</span>
              </TrackedNavLink>
            ) : null}

            {user ? (
              <div className="flex flex-col gap-3 border-t border-slate-200/50 pt-4">
                <span className="text-sm text-slate-500">
                  {user.name} {role ? `(${role})` : null}
                </span>
                <LogoutButton className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70" />
              </div>
            ) : (
              <TrackedNavLink
                href="/login"
                destination="/login"
                className="w-fit rounded-full bg-[#1b64f2] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(27,100,242,0.8)] transition hover:bg-blue-600"
              >
                Login
              </TrackedNavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
