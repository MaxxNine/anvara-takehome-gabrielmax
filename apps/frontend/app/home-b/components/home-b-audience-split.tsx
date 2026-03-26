import { BarChart3, Check, Eye, Mail, Mic, Monitor, Rocket } from 'lucide-react';

import {
  homeBAudiencePanels,
  homeBPublisherBenefits,
  homeBPublisherInventoryItems,
  homeBSponsorFeatures,
} from '../content';
import { homeBDisplayFont } from '../fonts';

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

function SponsorShowcase() {
  return (
    <div className="relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.28)]">
      <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1b64f2]" />
            <p className="text-sm font-semibold text-slate-600">Sponsor Workspace</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-500 shadow-sm">
            3 active briefs
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.35rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1b64f2]">
                  Campaign Fit
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  New product launch
                </h3>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                12 matches
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ['Podcast', 'Creator Circuit Midroll', 'High intent'],
                ['Newsletter', 'Operator Brief Feature', 'Operators'],
                ['Display', 'Growth Memo Display', 'Awareness'],
              ].map(([type, title, note]) => (
                <div
                  key={title}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {type}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{title}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#1b64f2]">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.35rem] bg-[#111827] p-5 text-white shadow-[0_24px_48px_-28px_rgba(17,24,39,0.8)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">
                Live Reach
              </p>
              <p className="mt-3 text-4xl font-bold tracking-tight">84.2k</p>
              <p className="mt-2 text-sm text-slate-300">Projected engagement across selected placements</p>
            </div>

            <div className="rounded-[1.35rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-end gap-3">
                {[42, 58, 50, 67, 61, 78].map((height, index) => (
                  <div key={index} className="flex-1">
                    <div
                      className={`rounded-t-2xl ${
                        index % 2 === 0 ? 'bg-[#1b64f2]' : 'bg-cyan-400'
                      }`}
                      style={{ height: `${height}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>Reach</span>
                <span>Conversion intent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
          <div className="mb-14 max-w-3xl">
            <h2
              id="home-b-sponsors-title"
              className={`${homeBDisplayFont.className} text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl`}
            >
              Built for <span className="text-[#1b64f2]">Sponsors</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{sponsorPanel.title}</p>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SponsorShowcase />
            </div>

            <div className="space-y-8 lg:col-span-5">
              {homeBSponsorFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1b64f2]">
                    <AudienceFeatureIcon kind={feature.icon} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{feature.body}</p>
                  </div>
                </div>
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
          <div className="order-2 lg:order-1">
            <PublisherInventoryShowcase />
          </div>

          <div className="order-1 lg:order-2">
            <h2
              id="home-b-publishers-title"
              className={`${homeBDisplayFont.className} text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl`}
            >
              Built for <span className="text-cyan-600">Publishers</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{publisherPanel.title}</p>

            <div className="mt-10 space-y-6">
              {homeBPublisherBenefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                      <path
                        d="m5 13 4 4L19 7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {publisherPanel.bullets.map((bullet) => (
                <span
                  key={bullet}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"
                >
                  {bullet}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
