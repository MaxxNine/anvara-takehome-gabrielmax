import { motion } from 'framer-motion';

import { SPONSOR_PLACEMENTS } from './data';
import { getRevealProps } from './motion';

type PlacementListProps = {
  isVisible: boolean;
  prefersReducedMotion: boolean;
};

export function PlacementList({ isVisible, prefersReducedMotion }: PlacementListProps) {
  return (
    <div className="mt-4 space-y-3">
      {SPONSOR_PLACEMENTS.map((placement, index) => (
        <motion.div
          key={placement.title}
          className="group/row flex cursor-default flex-col items-start gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-[0_4px_12px_-4px_rgba(27,100,242,0.15)] sm:flex-row sm:items-center sm:justify-between sm:gap-3"
          {...getRevealProps({
            delay: 0.6 + index * 0.14,
            duration: 0.5,
            hidden: { opacity: 0, x: -32 },
            isVisible,
            prefersReducedMotion,
          })}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors group-hover/row:text-blue-400">
              {placement.type}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800 transition-colors group-hover/row:text-slate-950">
              {placement.title}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#1b64f2] transition-all group-hover/row:bg-blue-100 group-hover/row:shadow-sm">
            {placement.note}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
