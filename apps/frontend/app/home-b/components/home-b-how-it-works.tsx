import { homeBSteps } from '../content';
import { homeBDisplayFont } from '../fonts';

export function HomeBHowItWorks() {
  return (
    <section
      aria-labelledby="home-b-how-it-works-title"
      className="rounded-[2rem] border border-[--color-border] bg-white px-6 py-8 sm:px-8"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
          How it works
        </p>
        <h2
          id="home-b-how-it-works-title"
          className={`${homeBDisplayFont.className} mt-3 text-3xl font-semibold tracking-[-0.04em] text-[--color-foreground]`}
        >
          Keep discovery simple and the next action obvious.
        </h2>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {homeBSteps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-[1.5rem] border border-[--color-border] bg-[--color-home-surface-alt] px-5 py-6"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[--color-primary] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-[--color-foreground]">{step.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-[--color-muted]">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
