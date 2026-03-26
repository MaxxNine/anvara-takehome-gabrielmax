'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type HomeBRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
  variant?: 'left' | 'right' | 'scale' | 'up';
};

const variantOffsets = {
  left: {
    x: -28,
    y: 0,
    scale: 1,
  },
  right: {
    x: 28,
    y: 0,
    scale: 1,
  },
  scale: {
    x: 0,
    y: 18,
    scale: 0.97,
  },
  up: {
    x: 0,
    y: 24,
    scale: 1,
  },
} as const;

export function HomeBReveal({
  children,
  className = '',
  delayMs = 0,
  threshold = 0.18,
  variant = 'up',
}: HomeBRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const hiddenState = variantOffsets[variant];

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: hiddenState.x,
        y: hiddenState.y,
        scale: hiddenState.scale,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ amount: threshold, once: true }}
      transition={{
        delay: delayMs / 1000,
        duration: 0.72,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
