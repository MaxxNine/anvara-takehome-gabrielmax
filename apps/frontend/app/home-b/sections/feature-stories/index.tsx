import { homeBTestimonials } from '../../content';
import { homeBDisplayFont } from '../../fonts';
import { HomeBReveal } from '../../shared/reveal';
import { TestimonialCard } from './testimonial-card';

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
              <TestimonialCard testimonial={testimonial} />
            </HomeBReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
