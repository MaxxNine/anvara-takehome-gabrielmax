import type { HomeBShowcaseCardItem } from '../content';

type HomeBShowcaseCardProps = {
  item: HomeBShowcaseCardItem;
};

const iconClassName = 'h-5 w-5 text-[#1b64f2]';

function ShowcaseIcon({ kind }: { kind: HomeBShowcaseCardItem['icon'] }) {
  if (kind === 'zap') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
        <path
          d="M13 2 3 14h8l-1 8 11-13h-8l1-7Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === 'chart') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
        <path d="M4 20V10" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20V4" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 20v-7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}

function VisibilityArtwork() {
  return (
    <div className="relative h-56 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,#dff1ff_0%,#c7dff5_46%,#8ba0bc_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(92,104,126,0)_0%,rgba(76,88,110,0.55)_30%,rgba(54,61,80,0.92)_100%)]" />
      <div className="absolute left-1/2 top-8 h-6 w-64 -translate-x-1/2 rounded-full bg-white/35 blur-2xl" />
      <div className="absolute bottom-11 left-1/2 h-28 w-64 -translate-x-1/2 rounded-[1.7rem] border border-white/10 bg-[#0f1116] shadow-[0_24px_44px_-12px_rgba(15,17,22,0.5)]">
        <div className="flex h-full items-center justify-center">
          <span className="text-[1.65rem] font-medium tracking-[0.28em] text-white">SEPHORA</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 h-14 w-4 -translate-x-1/2 rounded-t-full bg-slate-600" />
      <div className="absolute bottom-7 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-slate-700/70 blur-[2px]" />
    </div>
  );
}

function ExecutionArtwork() {
  return (
    <div className="relative h-56 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(135deg,#cc7b3a_0%,#9b541f_55%,#73340f_100%)] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),rgba(255,255,255,0)_42%)]" />
      <div className="relative rounded-[1.6rem] border border-white/50 bg-white p-4 shadow-[0_20px_30px_-18px_rgba(28,25,23,0.45)]">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Digital contract</span>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] text-emerald-700">
            Signed
          </span>
        </div>
        <div className="mt-4 flex gap-2 text-[10px] font-semibold text-slate-400">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">Overview</span>
          <span className="rounded-full px-2 py-1">Workflow</span>
        </div>
        <div className="mt-4 space-y-3">
          {['Digital contract', 'Digital materials', 'Digital creative'].map((label, index) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-lg ${
                    index === 0
                      ? 'bg-blue-100'
                      : index === 1
                        ? 'bg-emerald-100'
                        : 'bg-purple-100'
                  }`}
                />
                <span className="text-[11px] font-medium text-slate-700">{label}</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsArtwork() {
  return (
    <div className="relative h-56 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,#17345d_0%,#0d1f3f_58%,#081324_100%)] p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),rgba(255,255,255,0)_45%)]" />
      <div className="relative rounded-[1.4rem] border border-white/10 bg-white p-3 shadow-[0_16px_24px_-18px_rgba(15,23,42,0.55)]">
        <div className="flex items-start justify-between text-[10px] font-semibold text-slate-400">
          <span>Dashboard</span>
          <div className="flex gap-1">
            <span className="rounded-full bg-slate-100 px-2 py-1">Impressions</span>
            <span className="rounded-full px-2 py-1">This Q</span>
          </div>
        </div>
        <div className="mt-3 h-20 rounded-2xl bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] p-3">
          <div className="flex h-full items-end gap-3">
            {[42, 66, 51, 74, 62, 78, 64].map((height, index) => (
              <div key={index} className="relative flex-1">
                <div
                  className={`absolute bottom-0 w-full rounded-t-full ${
                    index % 3 === 0
                      ? 'bg-blue-400'
                      : index % 3 === 1
                        ? 'bg-violet-400'
                        : 'bg-cyan-400'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[1.8fr_1fr] gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex h-16 items-end gap-2">
              {[35, 52, 44, 63, 58, 72].map((height, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t-md ${
                    index % 2 === 0 ? 'bg-blue-500' : 'bg-violet-500'
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2 rounded-2xl bg-slate-50 p-3 text-[10px]">
            {[
              ['Exposure', '1.25M'],
              ['CTR', '3.8%'],
              ['Engaged', '19K'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-slate-500">
                <span>{label}</span>
                <span className="font-semibold text-slate-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowcaseArtwork({ kind }: { kind: HomeBShowcaseCardItem['artwork'] }) {
  if (kind === 'execution') {
    return <ExecutionArtwork />;
  }

  if (kind === 'analytics') {
    return <AnalyticsArtwork />;
  }

  return <VisibilityArtwork />;
}

export function HomeBShowcaseCard({ item }: HomeBShowcaseCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_60px_-26px_rgba(15,23,42,0.22)] transition-transform duration-300 hover:-translate-y-1">
      <ShowcaseArtwork kind={item.artwork} />

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <ShowcaseIcon kind={item.icon} />
          </div>
          <h3 className="text-[1.75rem] font-semibold tracking-tight text-slate-950">
            {item.title}
          </h3>
        </div>

        <p className="mt-5 flex-1 text-base leading-8 text-slate-600">{item.body}</p>

        <a
          href={item.href}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1b64f2] transition group-hover:text-blue-700"
        >
          Learn more
          <span aria-hidden="true" className="text-base leading-none">
            ›
          </span>
        </a>
      </div>
    </article>
  );
}
