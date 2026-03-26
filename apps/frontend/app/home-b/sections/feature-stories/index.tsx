import { homeBTestimonials } from '../../content';
import { homeBDisplayFont } from '../../fonts';
import { HomeBReveal } from '../../shared/reveal';
import { TestimonialCard } from './testimonial-card';

export function HomeBFeatureStories() {
  return (
    <section className="bg-white px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-12">
      <div className="mx-auto max-w-7xl">
        <HomeBReveal className="mx-auto max-w-3xl text-center">
          <h2
            className={`${homeBDisplayFont.className} text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl`}
          >
            Success Stories
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Hear from marketing leads and publishers scaling culture-first partnerships with
            Anvara.
          </p>
        </HomeBReveal>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
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
