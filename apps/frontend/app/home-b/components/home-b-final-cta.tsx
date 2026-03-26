'use client';

import { useState } from 'react';

import { homeBDisplayFont } from '../fonts';
import { HomeBCtaLink } from './home-b-cta-link';

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  }

  return (
    <div className="mx-auto mt-14 max-w-md text-center">
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <p className="mt-8 text-sm font-medium text-slate-400">
        Not ready yet? Get marketplace insights delivered weekly.
      </p>

      {submitted ? (
        <p className="mt-4 text-sm font-semibold text-emerald-400">
          You&apos;re in! We&apos;ll be in touch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

export function HomeBFinalCta() {
  return (
    <section className="px-5 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.75rem] bg-slate-950 px-6 py-14 sm:px-14 sm:py-18 lg:px-20 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(27,100,242,0.28),rgba(27,100,242,0)_38%),radial-gradient(circle_at_left,rgba(34,211,238,0.18),rgba(34,211,238,0)_28%)]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2
              className={`${homeBDisplayFont.className} text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl`}
            >
              Ready to join the future of the marketplace?
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
              Whether you&apos;re a brand looking for impact or a publisher looking for growth,
              Anvara is your connection engine.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <HomeBCtaLink
                href="/login"
                label="launch_as_sponsor"
                location="home_b_final_cta"
              >
                Launch as Sponsor
              </HomeBCtaLink>
              <HomeBCtaLink
                href="/login"
                label="join_as_publisher"
                location="home_b_final_cta"
                variant="secondary"
              >
                Join as Publisher
              </HomeBCtaLink>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
