import { homeBAudiencePanels } from '../content';
import { homeBDisplayFont } from '../fonts';

export function HomeBAudienceSplit() {
  return (
    <section aria-labelledby="home-b-audience-title" className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[2rem] border border-[--color-border] bg-white px-6 py-8 sm:px-8 lg:col-span-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
          Two-sided marketplace
        </p>
        <h2
          id="home-b-audience-title"
          className={`${homeBDisplayFont.className} mt-3 text-3xl font-semibold tracking-[-0.04em] text-[--color-foreground]`}
        >
          One homepage, two clear reasons to stay.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-[--color-muted]">
          Sponsors need confident inventory discovery. Publishers need a stronger way to present
          what they sell. Both sides should recognize themselves here without the page splitting too
          early.
        </p>
      </div>

      {homeBAudiencePanels.map((panel) => (
        <article
          key={panel.eyebrow}
          className="rounded-[2rem] border border-[--color-border] bg-white px-6 py-8 sm:px-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
            {panel.eyebrow}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[--color-foreground]">{panel.title}</h3>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-[--color-muted]">
            {panel.bullets.map((bullet) => (
              <li key={bullet} className="rounded-2xl bg-[--color-home-surface-alt] px-4 py-3">
                {bullet}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
