import { homeBFeatures } from '../content';
import { homeBDisplayFont } from '../fonts';

function getFeatureSectionClasses(tone: (typeof homeBFeatures)[number]['tone']): string {
  if (tone === 'ink') {
    return 'bg-[--color-home-ink] text-white shadow-[0_28px_80px_rgba(17,24,39,0.18)]';
  }

  if (tone === 'soft') {
    return 'bg-[--color-home-surface-alt] text-[--color-foreground]';
  }

  return 'bg-white text-[--color-foreground]';
}

function getMutedTextClasses(tone: (typeof homeBFeatures)[number]['tone']): string {
  return tone === 'ink' ? 'text-white/72' : 'text-[--color-muted]';
}

export function HomeBFeatureStories() {
  return (
    <section aria-labelledby="home-b-feature-stories-title" className="space-y-4">
      <div className="max-w-2xl px-1">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
          Feature stories
        </p>
        <h2
          id="home-b-feature-stories-title"
          className={`${homeBDisplayFont.className} mt-3 text-3xl font-semibold tracking-[-0.04em] text-[--color-foreground]`}
        >
          A bright page still needs one strong contrast moment, not several.
        </h2>
      </div>

      {homeBFeatures.map((feature, index) => (
        <article
          key={feature.title}
          className={`grid gap-6 rounded-[2rem] border border-[--color-border] px-6 py-8 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center ${
            index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
          } ${getFeatureSectionClasses(feature.tone)}`}
        >
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                feature.tone === 'ink' ? 'text-[--color-home-data]' : 'text-[--color-primary]'
              }`}
            >
              {feature.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-semibold">{feature.title}</h3>
            <p className={`mt-4 text-base leading-7 ${getMutedTextClasses(feature.tone)}`}>
              {feature.body}
            </p>
          </div>

          <div
            className={`rounded-[1.75rem] border px-5 py-5 ${
              feature.tone === 'ink'
                ? 'border-white/12 bg-white/6'
                : 'border-[--color-border] bg-white'
            }`}
          >
            <p className={`text-xs font-medium uppercase tracking-[0.18em] ${getMutedTextClasses(feature.tone)}`}>
              Visual anchors
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {feature.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    feature.tone === 'ink'
                      ? 'bg-white/10 text-white'
                      : 'bg-[--color-home-surface-alt] text-[--color-foreground]'
                  }`}
                >
                  {highlight}
                </span>
              ))}
            </div>
            <div
              className={`mt-5 rounded-[1.5rem] px-4 py-4 ${
                feature.tone === 'ink'
                  ? 'bg-black/12'
                  : 'border border-[--color-border] bg-[--color-home-surface-alt]'
              }`}
            >
              <p className={`text-sm leading-6 ${getMutedTextClasses(feature.tone)}`}>
                Use the darker ink treatment once, as the strongest feature emphasis on the page.
                Everywhere else should stay inside the bright-white system.
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
