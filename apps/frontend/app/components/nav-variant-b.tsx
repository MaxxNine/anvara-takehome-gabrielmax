'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { UserRole } from '@/lib/types';
import type { NavUser } from './nav';
import { LogoutButton } from './logout-button';
import { TrackedNavLink } from './tracked-nav-link';

type NavVariantBProps = {
  role: UserRole | null;
  user: NavUser;
};

export function NavVariantB({ user, role }: NavVariantBProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactToastOpen, setContactToastOpen] = useState(false);
  const contactToastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (contactToastTimeoutRef.current) {
        window.clearTimeout(contactToastTimeoutRef.current);
      }
    };
  }, []);

  const hasBg = scrolled || menuOpen;

  const linkClass = `text-sm font-medium transition-colors duration-300 cursor-pointer ${
    hasBg ? 'text-slate-600 hover:text-slate-950' : 'text-white/80 hover:text-white'
  }`;

  function closeMenu() {
    setMenuOpen(false);
  }

  function openContactToast() {
    closeMenu();
    setContactToastOpen(true);

    if (contactToastTimeoutRef.current) {
      window.clearTimeout(contactToastTimeoutRef.current);
    }

    contactToastTimeoutRef.current = window.setTimeout(() => {
      setContactToastOpen(false);
      contactToastTimeoutRef.current = null;
    }, 3200);
  }

  return (
    <>
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
          {user ? (
            <TrackedNavLink href="/marketplace" destination="/marketplace" className={linkClass}>
              Marketplace
            </TrackedNavLink>
          ) : (
            <button type="button" onClick={openContactToast} className={linkClass}>
              Contact us
            </button>
          )}

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
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            {user ? (
              <TrackedNavLink
                href="/marketplace"
                destination="/marketplace"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                <span onClick={closeMenu}>Marketplace</span>
              </TrackedNavLink>
            ) : (
              <button
                type="button"
                onClick={openContactToast}
                className="w-fit text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                Contact us
              </button>
            )}

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
                <span onClick={closeMenu}>Login</span>
              </TrackedNavLink>
            )}
            </div>
          </div>
        </div>

      </header>

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-end sm:inset-x-6 sm:bottom-6"
      >
        <div
          className={`w-full max-w-sm rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur transition-all duration-300 ${
            contactToastOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
          role="status"
        >
          <p className="text-sm font-semibold text-slate-950">Contact us is mocked for now</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            This CTA is a landing-page placeholder in the take-home. The real contact flow is not
            wired yet.
          </p>
        </div>
      </div>
    </>
  );
}
