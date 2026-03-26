import { Star } from 'lucide-react';

import { homeBTestimonials } from '../../content';
import { homeBDisplayFont } from '../../fonts';
import { HomeBReveal } from '../../shared/reveal';

function TestimonialStars({ accent }: { accent: (typeof homeBTestimonials)[number]['accent'] }) {
  const colorClass =
    accent === 'secondary'
      ? 'text-cyan-500'
      : accent === 'tertiary'
        ? 'text-violet-500'
        : 'text-[#1b64f2]';

  return (
    <div className={`flex gap-1 ${colorClass}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Star key={index} className="h-5 w-5 fill-current" />
      ))}
    </div>
  );
}

export function HomeBFeatureStories() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <HomeBReveal className="mx-auto max-w-2xl text-center">
          <h2
            className={`${homeBDisplayFont.className} text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl`}
          >
            Success Stories
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Hear from marketing leads and publishers scaling culture-first partnerships with
            Anvara.
          </p>
        </HomeBReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {homeBTestimonials.map((testimonial, index) => (
            <HomeBReveal key={testimonial.name} delayMs={140 + index * 110} variant="up">
              <article className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)]">
                <div>
                  <TestimonialStars accent={testimonial.accent} />
                  <p className="mt-6 text-base leading-8 text-slate-700">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${
                      testimonial.accent === 'secondary'
                        ? 'bg-cyan-500'
                        : testimonial.accent === 'tertiary'
                          ? 'bg-violet-500'
                          : 'bg-[#1b64f2]'
                    }`}
                  >
                    {testimonial.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{testimonial.name}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </article>
            </HomeBReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
