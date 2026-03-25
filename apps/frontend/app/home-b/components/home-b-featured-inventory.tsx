import { homeBPreviewSlots } from '../content';
import { homeBDisplayFont } from '../fonts';
import { HomeBCtaLink } from './home-b-cta-link';
import { HomeBSlotPreviewCard } from './home-b-slot-card';

export function HomeBFeaturedInventory() {
  const [featuredSlot, ...supportingSlots] = homeBPreviewSlots;

  return (
    <section
      aria-labelledby="home-b-featured-inventory-title"
      className="rounded-[2rem] border border-[--color-border] bg-[--color-home-surface-alt] px-6 py-8 sm:px-8 sm:py-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
            Featured inventory
          </p>
          <h2
            id="home-b-featured-inventory-title"
            className={`${homeBDisplayFont.className} mt-3 text-3xl font-semibold tracking-[-0.04em] text-[--color-foreground]`}
          >
            A curated preview that feels editorial, not repetitive.
          </h2>
          <p className="mt-3 text-base leading-7 text-[--color-muted]">
            The hero handles the interactive format exploration. This section shifts to a more
            curated layout so the landing page keeps moving instead of repeating the same pattern.
          </p>
        </div>

        <HomeBCtaLink
          href="/marketplace"
          label="browse_featured_inventory"
          location="home_b_featured_inventory"
          variant="secondary"
        >
          View live marketplace
        </HomeBCtaLink>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <HomeBSlotPreviewCard slot={featuredSlot} />

        <div className="grid gap-4">
          {supportingSlots.slice(0, 3).map((slot) => (
            <HomeBSlotPreviewCard key={`${slot.type}-${slot.name}`} compact slot={slot} />
          ))}
        </div>
      </div>
    </section>
  );
}
