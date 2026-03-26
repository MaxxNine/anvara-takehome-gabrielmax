import { BarChart3, Check, Eye, Mail, Mic, Monitor, Rocket } from 'lucide-react';

import {
  homeBAudiencePanels,
  homeBPublisherBenefits,
  homeBPublisherInventoryItems,
  homeBSponsorFeatures,
} from '../../content';
import { homeBDisplayFont } from '../../fonts';
import { HomeBReveal } from '../../shared/reveal';
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

function PublisherInventoryShowcase() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.25)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Inventory Manager</h3>
        <div className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold text-cyan-700">
          + Add Slot
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {homeBPublisherInventoryItems.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  item.type === 'display'
                    ? 'bg-blue-100 text-[#1b64f2]'
                    : item.type === 'podcast'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-cyan-100 text-cyan-700'
                }`}
              >
                {item.type === 'display' ? (
                  <Monitor className="h-5 w-5" />
                ) : item.type === 'podcast' ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              </div>
            </div>

            <span
              className={`text-xs font-bold ${
                item.status === 'Live' ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeBAudienceSplit() {
  const [sponsorPanel, publisherPanel] = homeBAudiencePanels;

  return (
    <>
      <section
        id="marketplace"
        aria-labelledby="home-b-sponsors-title"
        className="relative overflow-hidden bg-white px-6 py-24 sm:px-10 sm:py-28"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(27,100,242,0.06),rgba(255,255,255,0)_36%)]" />
        <div className="relative mx-auto max-w-7xl">
          <HomeBReveal className="mb-14 max-w-3xl">
            <h2
              id="home-b-sponsors-title"
              className={`${homeBDisplayFont.className} text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl`}
            >
              Built for <span className="text-[#1b64f2]">Sponsors</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{sponsorPanel.title}</p>
          </HomeBReveal>

          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SponsorShowcase />
            </div>

            <div className="space-y-8 lg:col-span-5">
              {homeBSponsorFeatures.map((feature, index) => (
                <HomeBReveal
                  key={feature.title}
                  delayMs={160 + index * 100}
                  variant="right"
                  className="flex items-start gap-5"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1b64f2]">
                    <AudienceFeatureIcon kind={feature.icon} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
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
        className="bg-[linear-gradient(180deg,#f7faff_0%,#f2f7ff_100%)] px-6 py-24 sm:px-10 sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <HomeBReveal className="order-2 lg:order-1" variant="left">
            <PublisherInventoryShowcase />
          </HomeBReveal>

          <div className="order-1 lg:order-2">
            <HomeBReveal>
              <h2
                id="home-b-publishers-title"
                className={`${homeBDisplayFont.className} text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl`}
              >
                Built for <span className="text-cyan-600">Publishers</span>
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">{publisherPanel.title}</p>
            </HomeBReveal>

            <div className="mt-10 space-y-6">
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
                    <h3 className="text-lg font-semibold text-slate-950">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.body}</p>
                  </div>
                </HomeBReveal>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {publisherPanel.bullets.map((bullet, index) => (
                <HomeBReveal key={bullet} delayMs={220 + index * 90} variant="up">
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                    {bullet}
                  </span>
                </HomeBReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
