'use client';

import { useEffect, useState } from 'react';

export function useRotatingIndex(length: number, intervalMs: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (length <= 1 || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, isPaused, length]);

  return {
    activeIndex,
    pauseRotation: () => setIsPaused(true),
    resumeRotation: () => setIsPaused(false),
    setActiveIndex,
  };
}
