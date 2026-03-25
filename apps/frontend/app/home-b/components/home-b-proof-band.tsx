import { homeBProofItems } from '../content';
import { homeBDisplayFont } from '../fonts';

export function HomeBProofBand() {
  return (
    <section
      aria-labelledby="home-b-proof-band-title"
      className="rounded-[2rem] border border-[--color-border] bg-white px-6 py-8 sm:px-8"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
            Proof and breadth
          </p>
          <h2
            id="home-b-proof-band-title"
            className={`${homeBDisplayFont.className} mt-3 text-3xl font-semibold tracking-[-0.04em] text-[--color-foreground]`}
          >
            The marketplace for display, video, podcast, and newsletter placements.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {homeBProofItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[--color-border] bg-[--color-home-surface-alt] px-4 py-4 text-sm font-medium text-[--color-foreground]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
