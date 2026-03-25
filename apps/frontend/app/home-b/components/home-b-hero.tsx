import { homeBPreviewSlots } from '../content';
import { homeBDisplayFont } from '../fonts';
import { HomeBCtaLink } from './home-b-cta-link';
import { HomeBFormatExplorer } from './home-b-format-explorer';

export function HomeBHero() {
  return (
    <section
      aria-labelledby="home-b-hero-title"
      className="relative overflow-hidden rounded-[2rem] border border-[--color-border] bg-white px-6 py-10 shadow-[0_30px_100px_rgba(17,24,39,0.08)] sm:px-10 sm:py-12"
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,rgba(155,183,255,0.38),transparent_55%),radial-gradient(circle_at_top_right,rgba(220,231,255,0.92),transparent_48%),linear-gradient(180deg,rgba(247,248,252,0.98),rgba(255,255,255,1))]" />
      <div className="absolute -left-16 top-16 h-40 w-40 rounded-full bg-[--color-home-highlight] blur-3xl" />
      <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-[rgba(62,107,255,0.14)] blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[--color-primary]">
            Sponsorship marketplace
          </p>
          <h1
            id="home-b-hero-title"
            className={`${homeBDisplayFont.className} mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[--color-foreground] sm:text-5xl lg:text-6xl`}
          >
            Find sponsorship inventory with the clarity a marketplace should have.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--color-muted] sm:text-lg">
            Anvara helps sponsors browse structured placements and gives publishers a cleaner way
            to present display, video, podcast, and newsletter inventory.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <HomeBCtaLink href="/login" label="get_started" location="home_b_hero">
              Get started
            </HomeBCtaLink>
            <HomeBCtaLink
              href="/marketplace"
              label="browse_marketplace"
              location="home_b_hero"
              variant="secondary"
            >
              Browse marketplace
            </HomeBCtaLink>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-[--color-muted]">
            <span className="rounded-full border border-[--color-border] bg-white px-4 py-2">
              4 placement formats
            </span>
            <span className="rounded-full border border-[--color-border] bg-white px-4 py-2">
              Pricing visible upfront
            </span>
            <span className="rounded-full border border-[--color-border] bg-white px-4 py-2">
              Bright, structured inventory preview
            </span>
          </div>
        </div>

        <div className="relative">
          <HomeBFormatExplorer slots={homeBPreviewSlots} />
        </div>
      </div>
    </section>
  );
}
