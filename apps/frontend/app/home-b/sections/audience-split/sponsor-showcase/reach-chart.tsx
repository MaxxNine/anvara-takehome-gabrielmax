import { AnimatePresence, motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { REACH_CHART_DATA } from './data';
import { REVEAL_EASE, getRevealProps } from './motion';

type ReachChartProps = {
  isVisible: boolean;
  prefersReducedMotion: boolean;
};

export function ReachChart({ isVisible, prefersReducedMotion }: ReachChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <motion.div
      className="rounded-[1.35rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
      {...getRevealProps({
        delay: 1,
        hidden: { opacity: 0, y: 24 },
        isVisible,
        prefersReducedMotion,
      })}
    >
      <motion.div
        className="mb-4 flex items-center justify-between"
        {...getRevealProps({
          delay: 1.1,
          duration: 0.5,
          hidden: { opacity: 0 },
          isVisible,
          prefersReducedMotion,
        })}
      >
        <p className="text-xs font-semibold text-slate-700">Monthly Reach</p>
        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">
          <TrendingUp className="h-3 w-3" />
          <span className="text-[10px] font-bold">+18%</span>
        </div>
      </motion.div>

      <div className="flex items-end gap-2" style={{ height: '78px' }}>
        {REACH_CHART_DATA.map((bar, index) => (
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
        {REACH_CHART_DATA.map((bar, index) => (
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
        {...getRevealProps({
          delay: 1.8,
          duration: 0.5,
          hidden: { opacity: 0 },
          isVisible,
          prefersReducedMotion,
        })}
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
  );
}
