'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import {
  SPONSOR_ACTIVE_BRIEFS_LABEL,
  SPONSOR_CAMPAIGN_TITLE,
  SPONSOR_MATCH_COUNT_LABEL,
  SPONSOR_WORKSPACE_LABEL,
} from './data';
import { LiveReachCard } from './live-reach-card';
import { getRevealProps } from './motion';
import { PlacementList } from './placement-list';
import { ReachChart } from './reach-chart';

export function SponsorShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const prefersReducedMotion = useReducedMotion() || false;
  const isVisible = prefersReducedMotion || isInView;

  return (
    <motion.div
      ref={ref}
      className="relative rounded-[1.75rem] border border-slate-200 bg-white p-2.5 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.28)] sm:rounded-[2rem] sm:p-3"
      {...getRevealProps({
        hidden: { opacity: 0, scale: 0.94 },
        isVisible,
        prefersReducedMotion,
      })}
    >
      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 sm:rounded-[1.6rem] sm:p-5">
        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          {...getRevealProps({
            delay: 0.2,
            hidden: { opacity: 0, y: 16 },
            isVisible,
            prefersReducedMotion,
          })}
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
            <p className="text-[13px] font-semibold text-slate-600 sm:text-sm">
              {SPONSOR_WORKSPACE_LABEL}
            </p>
          </div>

          <motion.div
            className="self-start rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-500 shadow-sm sm:self-auto"
            {...getRevealProps({
              delay: 0.35,
              duration: 0.5,
              hidden: { opacity: 0, x: 16 },
              isVisible,
              prefersReducedMotion,
            })}
          >
            {SPONSOR_ACTIVE_BRIEFS_LABEL}
          </motion.div>
        </motion.div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            className="rounded-[1.25rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:rounded-[1.35rem]"
            {...getRevealProps({
              delay: 0.4,
              hidden: { opacity: 0, y: 24 },
              isVisible,
              prefersReducedMotion,
            })}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1b64f2]">
                  Campaign Fit
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  {SPONSOR_CAMPAIGN_TITLE}
                </h3>
              </div>

              <motion.div
                className="self-start rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:self-auto"
                {...getRevealProps({
                  delay: 0.7,
                  duration: 0.5,
                  hidden: { opacity: 0, scale: 0.5 },
                  isVisible,
                  prefersReducedMotion,
                })}
              >
                {SPONSOR_MATCH_COUNT_LABEL}
              </motion.div>
            </div>

            <PlacementList isVisible={isVisible} prefersReducedMotion={prefersReducedMotion} />
          </motion.div>

          <div className="grid gap-4 min-[430px]:grid-cols-2 xl:grid-cols-1">
            <LiveReachCard
              isInView={isInView}
              isVisible={isVisible}
              prefersReducedMotion={prefersReducedMotion}
            />
            <ReachChart isVisible={isVisible} prefersReducedMotion={prefersReducedMotion} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
