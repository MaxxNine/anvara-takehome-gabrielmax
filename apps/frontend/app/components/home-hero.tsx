import { HomeCtaLink } from './home-cta-link';

type HomeHeroProps = {
  variant: string;
};

function HomeHeroVariantA() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Anvara</h1>
      <p className="mb-8 max-w-md text-[--color-muted]">
        The sponsorship marketplace connecting sponsors with publishers.
      </p>

      <div className="flex gap-4">
        <HomeCtaLink />
      </div>

      <div className="mt-16 grid gap-8 text-left sm:grid-cols-2">
        <div className="rounded-lg border border-[--color-border] p-6">
          <h2 className="mb-2 text-lg font-semibold text-[--color-primary]">For Sponsors</h2>
          <p className="text-sm text-[--color-muted]">
            Create campaigns, set budgets, and reach your target audience through premium
            publishers.
          </p>
        </div>
        <div className="rounded-lg border border-[--color-border] p-6">
          <h2 className="mb-2 text-lg font-semibold text-[--color-secondary]">For Publishers</h2>
          <p className="text-sm text-[--color-muted]">
            List your ad slots, set your rates, and connect with sponsors looking for your
            audience.
          </p>
        </div>
      </div>
    </div>
  );
}

function HomeHeroVariantB() {
  return (
    <div className="space-y-12 py-12">
      <section className="overflow-hidden rounded-3xl border border-[--color-border] bg-gradient-to-br from-white via-[--color-background] to-[rgba(14,165,233,0.08)] px-8 py-12 text-center shadow-sm">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
          Marketplace Matchmaking
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Launch sponsor partnerships without the slow back-and-forth.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-[--color-muted] sm:text-lg">
          Anvara helps sponsors find trusted publisher inventory and gives publishers a faster way
          to turn audience fit into recurring revenue.
        </p>

        <div className="mt-8 flex justify-center">
          <HomeCtaLink />
        </div>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-[--color-border] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[--color-foreground]">For sponsors</p>
            <p className="mt-2 text-sm text-[--color-muted]">
              Discover placements, compare prices, and request inventory in one flow.
            </p>
          </div>
          <div className="rounded-2xl border border-[--color-border] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[--color-foreground]">For publishers</p>
            <p className="mt-2 text-sm text-[--color-muted]">
              List ad slots, manage requests, and keep your inventory visible.
            </p>
          </div>
          <div className="rounded-2xl border border-[--color-border] bg-white/80 p-5">
            <p className="text-sm font-semibold text-[--color-foreground]">For both sides</p>
            <p className="mt-2 text-sm text-[--color-muted]">
              Turn introductions into placement requests with clearer pricing and less friction.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function HomeHero({ variant }: HomeHeroProps) {
  if (variant === 'B') {
    return <HomeHeroVariantB />;
  }

  return <HomeHeroVariantA />;
}
