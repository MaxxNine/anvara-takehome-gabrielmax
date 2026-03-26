import { Check } from 'lucide-react';

import { homeBAudiencePanels, homeBPublisherBenefits } from '../../../content';
import { homeBDisplayFont } from '../../../fonts';
import { HomeBReveal } from '../../../shared/reveal';

type PublisherContentProps = {
  panel: (typeof homeBAudiencePanels)[number];
};

export function PublisherContent({ panel }: PublisherContentProps) {
  return (
    <div>
      <HomeBReveal>
        <h2
          id="home-b-publishers-title"
          className={`${homeBDisplayFont.className} text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl`}
        >
          Built for <span className="text-cyan-600">Publishers</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
          {panel.title}
        </p>
      </HomeBReveal>

      <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
        {homeBPublisherBenefits.map((benefit, index) => (
          <HomeBReveal
            key={benefit.title}
            delayMs={140 + index * 110}
            variant="right"
            className="flex items-start gap-4"
          >
            <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-white">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-950 sm:text-lg">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.body}</p>
            </div>
          </HomeBReveal>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
        {panel.bullets.map((bullet, index) => (
          <HomeBReveal key={bullet} delayMs={220 + index * 90} variant="up">
            <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 sm:px-4">
              {bullet}
            </span>
          </HomeBReveal>
        ))}
      </div>
    </div>
  );
}
