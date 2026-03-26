'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCountUp(end: number, durationMs: number, active: boolean, delayMs = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let raf: number;
    let t0: number | null = null;
    const ease = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

    const timeout = setTimeout(() => {
      const tick = (now: number) => {
        if (t0 === null) t0 = now;
        const progress = Math.min((now - t0) / durationMs, 1);
        setValue(ease(progress) * end);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, end, durationMs, delayMs]);

  return value;
}

const PLACEMENTS = [
  ['Podcast', 'Creator Circuit Midroll', 'High intent'],
  ['Newsletter', 'Operator Brief Feature', 'Operators'],
  ['Display', 'Growth Memo Display', 'Awareness'],
] as const;

const CHART_DATA = [
  { label: 'Jan', value: 42, display: '4.2k' },
  { label: 'Feb', value: 58, display: '5.8k' },
  { label: 'Mar', value: 50, display: '5.0k' },
  { label: 'Apr', value: 67, display: '6.7k' },
  { label: 'May', value: 61, display: '6.1k' },
  { label: 'Jun', value: 78, display: '7.8k' },
];

export function SponsorShowcase() {
  const { ref, inView } = useInView(0.2);
  const reachCount = useCountUp(84.2, 2000, inView, 1000);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div
      ref={ref}
      className={`relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.28)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        inView ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-0'
      }`}
    >
      <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
        {/* Header */}
        <div
          className={`flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: inView ? '200ms' : '0ms' }}
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full bg-[#1b64f2] transition-transform duration-500 ${
                inView ? 'scale-100 animate-pulse' : 'scale-0'
              }`}
              style={{ transitionDelay: inView ? '400ms' : '0ms' }}
            />
            <p className="text-sm font-semibold text-slate-600">Sponsor Workspace</p>
          </div>
          <div
            className={`rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-500 shadow-sm transition-all duration-500 ${
              inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: inView ? '350ms' : '0ms' }}
          >
            3 active briefs
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Campaign Fit Card */}
          <div
            className={`rounded-[1.35rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: inView ? '400ms' : '0ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1b64f2]">
                  Campaign Fit
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">New product launch</h3>
              </div>
              <div
                className={`rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
                style={{ transitionDelay: inView ? '700ms' : '0ms' }}
              >
                12 matches
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {PLACEMENTS.map(([type, title, note], index) => (
                <div
                  key={title}
                  className={`group/row flex cursor-default items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-[0_4px_12px_-4px_rgba(27,100,242,0.15)] ${
                    inView ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: inView ? `${600 + index * 140}ms` : '0ms' }}
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors group-hover/row:text-blue-400">
                      {type}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 transition-colors group-hover/row:text-slate-950">
                      {title}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#1b64f2] transition-all group-hover/row:bg-blue-100 group-hover/row:shadow-sm">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="grid gap-4">
            {/* Live Reach */}
            <div
              className={`rounded-[1.35rem] bg-[#111827] p-5 text-white shadow-[0_24px_48px_-28px_rgba(17,24,39,0.8)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                inView ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: inView ? '800ms' : '0ms' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">
                Live Reach
              </p>
              <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight">
                {reachCount.toFixed(1)}k
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Projected engagement across selected placements
              </p>
            </div>

            {/* Bar chart */}
            <div
              className={`rounded-[1.35rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: inView ? '1000ms' : '0ms' }}
            >
              {/* Chart header */}
              <div
                className={`mb-4 flex items-center justify-between transition-all duration-500 ${
                  inView ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: inView ? '1100ms' : '0ms' }}
              >
                <p className="text-xs font-semibold text-slate-700">Monthly Reach</p>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-[10px] font-bold">+18%</span>
                </div>
              </div>

              {/* Bars */}
              <div className="flex items-end gap-2" style={{ height: '78px' }}>
                {CHART_DATA.map((bar, index) => (
                  <div
                    key={index}
                    className="relative flex h-full flex-1 cursor-pointer items-end"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg transition-all duration-200 ${
                        hoveredBar === index
                          ? 'translate-y-0 opacity-100'
                          : 'pointer-events-none translate-y-1 opacity-0'
                      }`}
                    >
                      {bar.display}
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-lg ${
                        index % 2 === 0 ? 'bg-[#1b64f2]' : 'bg-cyan-400'
                      }`}
                      style={{
                        height: inView ? `${bar.value}px` : '0px',
                        opacity: hoveredBar !== null && hoveredBar !== index ? 0.35 : 1,
                        transform: hoveredBar === index ? 'scaleX(1.1)' : 'scaleX(1)',
                        filter: hoveredBar === index ? 'brightness(1.15)' : 'brightness(1)',
                        transition: [
                          `height 1000ms cubic-bezier(0.22,1,0.36,1) ${inView ? `${1200 + index * 100}ms` : '0ms'}`,
                          'opacity 200ms ease',
                          'transform 200ms ease',
                          'filter 200ms ease',
                        ].join(', '),
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Month labels */}
              <div className="mt-2 flex gap-2">
                {CHART_DATA.map((bar, index) => (
                  <span
                    key={index}
                    className={`flex-1 text-center text-[10px] font-medium transition-colors duration-200 ${
                      hoveredBar === index ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {bar.label}
                  </span>
                ))}
              </div>

              {/* Legend */}
              <div
                className={`mt-3 flex items-center justify-center gap-4 transition-all duration-500 ${
                  inView ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: inView ? '1800ms' : '0ms' }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1b64f2]" />
                  <span className="text-[10px] font-medium text-slate-400">Impressions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-[10px] font-medium text-slate-400">Engagement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
