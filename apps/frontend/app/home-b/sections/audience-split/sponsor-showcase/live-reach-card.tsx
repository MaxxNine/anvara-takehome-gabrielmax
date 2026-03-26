import { animate, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { SPONSOR_REACH_VALUE } from './data';
import { REVEAL_EASE, getRevealProps } from './motion';

type LiveReachCardProps = {
  isInView: boolean;
  isVisible: boolean;
  prefersReducedMotion: boolean;
};

export function LiveReachCard({
  isInView,
  isVisible,
  prefersReducedMotion,
}: LiveReachCardProps) {
  const [reachCount, setReachCount] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      return;
    }

    const controls = animate(0, SPONSOR_REACH_VALUE, {
      delay: 1,
      duration: 2,
      ease: REVEAL_EASE,
      onUpdate: (latest) => {
        setReachCount(latest);
      },
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion]);

  return (
    <motion.div
      className="rounded-[1.35rem] bg-[#111827] p-5 text-white shadow-[0_24px_48px_-28px_rgba(17,24,39,0.8)]"
      {...getRevealProps({
        delay: 0.8,
        hidden: { opacity: 0, x: 32 },
        isVisible,
        prefersReducedMotion,
      })}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">
        Live Reach
      </p>
      <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight">
        {prefersReducedMotion ? `${SPONSOR_REACH_VALUE.toFixed(1)}k` : `${reachCount.toFixed(1)}k`}
      </p>
      <p className="mt-2 text-sm text-slate-300">
        Projected engagement across selected placements
      </p>
    </motion.div>
  );
}
