import type { TargetAndTransition, Transition } from 'framer-motion';

export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

type RevealState = {
  opacity: number;
  scale?: number;
  x?: number;
  y?: number;
};

type RevealOptions = {
  delay?: number;
  duration?: number;
  hidden: RevealState;
  isVisible: boolean;
  prefersReducedMotion: boolean;
};

export function getRevealProps({
  delay = 0,
  duration = 0.7,
  hidden,
  isVisible,
  prefersReducedMotion,
}: RevealOptions) {
  const animate: TargetAndTransition = isVisible
    ? { opacity: 1, scale: 1, x: 0, y: 0 }
    : hidden;
  const transition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        delay,
        duration,
        ease: REVEAL_EASE,
      };

  return {
    animate,
    initial: prefersReducedMotion ? false : hidden,
    transition,
  };
}
