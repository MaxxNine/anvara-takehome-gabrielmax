'use client';

import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
] as const;

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

type RevealState = {
  opacity: number;
  scale?: number;
  x?: number;
  y?: number;
};

export function SponsorShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const prefersReducedMotion = useReducedMotion();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [reachCount, setReachCount] = useState(0);
  const isVisible = prefersReducedMotion || isInView;

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      return;
    }

    const controls = animate(0, 84.2, {
      delay: 1,
      duration: 2,
      ease: REVEAL_EASE,
      onUpdate: (latest) => {
        setReachCount(latest);
      },
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion]);

  const reveal = (hidden: RevealState, delay = 0, duration = 0.7) => ({
    animate: isVisible ? { opacity: 1, scale: 1, x: 0, y: 0 } : hidden,
    initial: prefersReducedMotion ? false : hidden,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : {
          delay,
          duration,
          ease: REVEAL_EASE,
        },
  });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.28)]"
      {...reveal({ opacity: 0, scale: 0.94 })}
    >
      <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
        <motion.div
          className="flex items-center justify-between"
          {...reveal({ opacity: 0, y: 16 }, 0.2)}
        >
          <div className="flex items-center gap-2">
            <motion.span
              className="h-2.5 w-2.5 rounded-full bg-[#1b64f2]"
              animate={
                isVisible && !prefersReducedMotion
                  ? {
                      opacity: [1, 0.45, 1],
                      scale: [1, 1.14, 1],
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                    }
              }
              transition={{
                delay: 0.4,
                duration: 1.8,
                ease: 'easeInOut',
                repeat: isVisible && !prefersReducedMotion ? Infinity : 0,
              }}
            />
            <p className="text-sm font-semibold text-slate-600">Sponsor Workspace</p>
          </div>

          <motion.div
            className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-500 shadow-sm"
            {...reveal({ opacity: 0, x: 16 }, 0.35, 0.5)}
          >
            3 active briefs
          </motion.div>
        </motion.div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            className="rounded-[1.35rem] bg-white p-4 shadow-sm ring-1 ring-slate-200"
            {...reveal({ opacity: 0, y: 24 }, 0.4)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1b64f2]">
                  Campaign Fit
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">New product launch</h3>
              </div>

              <motion.div
                className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700"
                {...reveal({ opacity: 0, scale: 0.5 }, 0.7, 0.5)}
              >
                12 matches
              </motion.div>
            </div>

            <div className="mt-4 space-y-3">
              {PLACEMENTS.map(([type, title, note], index) => (
                <motion.div
                  key={title}
                  className="group/row flex cursor-default items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-[0_4px_12px_-4px_rgba(27,100,242,0.15)]"
                  {...reveal({ opacity: 0, x: -32 }, 0.6 + index * 0.14, 0.5)}
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-4">
            <motion.div
              className="rounded-[1.35rem] bg-[#111827] p-5 text-white shadow-[0_24px_48px_-28px_rgba(17,24,39,0.8)]"
              {...reveal({ opacity: 0, x: 32 }, 0.8)}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">
                Live Reach
              </p>
              <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight">
                {prefersReducedMotion ? '84.2k' : `${reachCount.toFixed(1)}k`}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Projected engagement across selected placements
              </p>
            </motion.div>

            <motion.div
              className="rounded-[1.35rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
              {...reveal({ opacity: 0, y: 24 }, 1)}
            >
              <motion.div
                className="mb-4 flex items-center justify-between"
                {...reveal({ opacity: 0 }, 1.1, 0.5)}
              >
                <p className="text-xs font-semibold text-slate-700">Monthly Reach</p>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-[10px] font-bold">+18%</span>
                </div>
              </motion.div>

              <div className="flex items-end gap-2" style={{ height: '78px' }}>
                {CHART_DATA.map((bar, index) => (
                  <div
                    key={bar.label}
                    className="relative flex h-full flex-1 cursor-pointer items-end"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <AnimatePresence>
                      {hoveredBar === index ? (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg"
                        >
                          {bar.display}
                          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <motion.div
                      className={`w-full rounded-t-lg ${
                        index % 2 === 0 ? 'bg-[#1b64f2]' : 'bg-cyan-400'
                      }`}
                      initial={prefersReducedMotion ? false : { height: 0 }}
                      animate={{
                        filter: hoveredBar === index ? 'brightness(1.15)' : 'brightness(1)',
                        height: isVisible ? `${bar.value}px` : '0px',
                        opacity: hoveredBar !== null && hoveredBar !== index ? 0.35 : 1,
                        scaleX: hoveredBar === index ? 1.1 : 1,
                      }}
                      style={{ transformOrigin: 'center bottom' }}
                      transition={{
                        filter: { duration: 0.2, ease: 'easeOut' },
                        height: prefersReducedMotion
                          ? { duration: 0 }
                          : {
                              delay: 1.2 + index * 0.1,
                              duration: 1,
                              ease: REVEAL_EASE,
                            },
                        opacity: { duration: 0.2, ease: 'easeOut' },
                        scaleX: { duration: 0.2, ease: 'easeOut' },
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2 flex gap-2">
                {CHART_DATA.map((bar, index) => (
                  <span
                    key={bar.label}
                    className={`flex-1 text-center text-[10px] font-medium transition-colors duration-200 ${
                      hoveredBar === index ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {bar.label}
                  </span>
                ))}
              </div>

              <motion.div
                className="mt-3 flex items-center justify-center gap-4"
                {...reveal({ opacity: 0 }, 1.8, 0.5)}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1b64f2]" />
                  <span className="text-[10px] font-medium text-slate-400">Impressions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-[10px] font-medium text-slate-400">Engagement</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
