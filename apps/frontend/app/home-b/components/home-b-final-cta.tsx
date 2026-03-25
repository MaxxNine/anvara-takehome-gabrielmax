import { homeBDisplayFont } from '../fonts';
import { HomeBCtaLink } from './home-b-cta-link';

export function HomeBFinalCta() {
  return (
    <section
      aria-labelledby="home-b-final-cta-title"
      className="overflow-hidden rounded-[2rem] border border-[--color-border] bg-white px-6 py-8 shadow-[0_24px_80px_rgba(17,24,39,0.07)] sm:px-8 sm:py-10"
    >
      <div className="relative">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[rgba(62,107,255,0.1)] blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
              Ready to explore
            </p>
            <h2
              id="home-b-final-cta-title"
              className={`${homeBDisplayFont.className} mt-3 text-3xl font-semibold tracking-[-0.04em] text-[--color-foreground] sm:text-4xl`}
            >
              Discover inventory without the usual back-and-forth.
            </h2>
            <p className="mt-4 text-base leading-7 text-[--color-muted]">
              Browse the live marketplace, compare placement types, and move into the platform with
              a clearer understanding of what Anvara actually enables.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <HomeBCtaLink href="/login" label="get_started" location="home_b_final_cta">
                Get started
              </HomeBCtaLink>
              <HomeBCtaLink
                href="/marketplace"
                label="browse_marketplace"
                location="home_b_final_cta"
                variant="secondary"
              >
                Browse marketplace
              </HomeBCtaLink>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[--color-home-surface-alt] px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[--color-muted]">
                Formats
              </p>
              <p className="mt-2 text-lg font-semibold text-[--color-foreground]">
                Display, video, podcast, newsletter
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[--color-border] px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[--color-muted]">
                Marketplace path
              </p>
              <p className="mt-2 text-lg font-semibold text-[--color-foreground]">
                Browse first, commit later
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
