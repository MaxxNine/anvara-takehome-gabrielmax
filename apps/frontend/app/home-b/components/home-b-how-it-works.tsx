import { homeBShowcaseCards } from '../content';
import { HomeBShowcaseCard } from './home-b-showcase-card';

export function HomeBHowItWorks() {
  return (
    <section aria-labelledby="home-b-showcase-title" className="relative px-6 pb-24 pt-14 sm:px-10 sm:pb-28 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        <h2 id="home-b-showcase-title" className="sr-only">
          Why teams use Anvara
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {homeBShowcaseCards.map((item) => (
            <HomeBShowcaseCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
