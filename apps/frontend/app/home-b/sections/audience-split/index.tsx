import { BarChart3, Eye, Rocket } from 'lucide-react';

import {
  homeBAudiencePanels,
  homeBSponsorFeatures,
} from '../../content';
import { homeBDisplayFont } from '../../fonts';
import { HomeBReveal } from '../../shared/reveal';
import { PublisherContent, PublisherInventoryShowcase } from './publisher-showcase';
import { SponsorShowcase } from './sponsor-showcase';

const featureIconComponents = {
  chart: BarChart3,
  eye: Eye,
  rocket: Rocket,
} as const;

function AudienceFeatureIcon({
  kind,
}: {
  kind: (typeof homeBSponsorFeatures)[number]['icon'];
}) {
  const Icon = featureIconComponents[kind];
  return <Icon className="h-6 w-6" />;
}

export function HomeBAudienceSplit() {
  const [sponsorPanel, publisherPanel] = homeBAudiencePanels;

  return (
    <>
      <section
        id="marketplace"
        aria-labelledby="home-b-sponsors-title"
        className="relative overflow-hidden bg-white px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(27,100,242,0.06),rgba(255,255,255,0)_36%)]" />
        <div className="relative mx-auto max-w-7xl">
          <HomeBReveal className="mb-12 max-w-3xl sm:mb-14">
            <h2
              id="home-b-sponsors-title"
              className={`${homeBDisplayFont.className} text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl`}
            >
              Built for <span className="text-[#1b64f2]">Sponsors</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              {sponsorPanel.title}
            </p>
          </HomeBReveal>

          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="lg:col-span-7">
              <SponsorShowcase />
            </div>

            <div className="space-y-6 sm:space-y-8 lg:col-span-5">
              {homeBSponsorFeatures.map((feature, index) => (
                <HomeBReveal
                  key={feature.title}
                  delayMs={160 + index * 100}
                  variant="right"
                  className="flex items-start gap-4 sm:gap-5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1b64f2] sm:h-12 sm:w-12 sm:rounded-2xl">
                    <AudienceFeatureIcon kind={feature.icon} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950 sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{feature.body}</p>
                  </div>
                </HomeBReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="home-b-publishers-title"
        className="bg-[linear-gradient(180deg,#f7faff_0%,#f2f7ff_100%)] px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-12"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-1 lg:order-2">
            <PublisherContent panel={publisherPanel} />
          </div>

          <HomeBReveal variant="left" className="order-2 lg:order-1">
            <PublisherInventoryShowcase />
          </HomeBReveal>
        </div>
      </section>
    </>
  );
}
