'use client';

import { useEffect, useMemo, useState } from 'react';

import type { HomeBPreviewRound } from '../content';

export type TypewriterPhase = 'typing' | 'idle' | 'deleting' | 'waiting';

type TypewriterRotationState = {
  activeRound: HomeBPreviewRound;
  displayText: string;
  phase: TypewriterPhase;
};

export function useTypewriterRotation(rounds: HomeBPreviewRound[]): TypewriterRotationState {
  const fallbackRound: HomeBPreviewRound = useMemo(
    () => ({
      query: '',
      slots: [],
    }),
    []
  );
  const [displayText, setDisplayText] = useState('');
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeRound = rounds[activeRoundIndex] ?? fallbackRound;
  const activeQuery = activeRound?.query ?? '';

  useEffect(() => {
    if (!activeQuery) {
      return;
    }

    let timeoutId = 0;

    if (!isDeleting && displayText.length < activeQuery.length) {
      // Typing — 60ms per character
      timeoutId = window.setTimeout(() => {
        setDisplayText(activeQuery.slice(0, displayText.length + 1));
      }, 60);
    } else if (!isDeleting && displayText.length === activeQuery.length) {
      // Idle — hold results visible for 3.5s
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true);
      }, 3500);
    } else if (isDeleting && displayText.length > 0) {
      // Deleting — 30ms per character
      timeoutId = window.setTimeout(() => {
        setDisplayText(activeQuery.slice(0, displayText.length - 1));
      }, 30);
    } else {
      // Waiting — pause before next round
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setActiveRoundIndex((currentIndex) => (currentIndex + 1) % Math.max(rounds.length, 1));
      }, 400);
    }

    return () => window.clearTimeout(timeoutId);
  }, [activeQuery, displayText, isDeleting, rounds.length]);

  const phase: TypewriterPhase = useMemo(() => {
    if (!isDeleting && displayText.length < activeQuery.length) return 'typing';
    if (!isDeleting && displayText.length === activeQuery.length) return 'idle';
    if (isDeleting && displayText.length > 0) return 'deleting';
    return 'waiting';
  }, [isDeleting, displayText.length, activeQuery.length]);

  return useMemo(
    () => ({
      activeRound,
      displayText,
      phase,
    }),
    [activeRound, displayText, phase]
  );
}
