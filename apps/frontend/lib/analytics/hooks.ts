'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import type { ActionState } from '../action-types';
import { trackEvent } from './core';
import { GA_EVENTS, type AnalyticsEventMap, type AnalyticsEventName } from './events';

type TrackOnMountOptions = {
  dedupeKey?: string;
  dedupeWindowMs?: number;
};

const DEFAULT_DEDUPE_WINDOW_MS = 1000;
const recentMountEvents = new Map<string, number>();

function buildPagePath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname;
}

function shouldTrackMountEvent({
  dedupeKey,
  dedupeWindowMs = DEFAULT_DEDUPE_WINDOW_MS,
}: TrackOnMountOptions): boolean {
  if (!dedupeKey) {
    return true;
  }

  const now = Date.now();
  const lastTrackedAt = recentMountEvents.get(dedupeKey);

  recentMountEvents.set(dedupeKey, now);

  for (const [trackedKey, trackedAt] of recentMountEvents) {
    if (now - trackedAt > dedupeWindowMs) {
      recentMountEvents.delete(trackedKey);
    }
  }

  return lastTrackedAt === undefined || now - lastTrackedAt > dedupeWindowMs;
}

export function useTrackPageView(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSeenInitialRouteRef = useRef(false);
  const search = searchParams.toString();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (!hasSeenInitialRouteRef.current) {
      hasSeenInitialRouteRef.current = true;
      return;
    }

    trackEvent(GA_EVENTS.PAGE_VIEW, {
      page_path: buildPagePath(pathname, search),
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);
}

export function useTrackOnMount<K extends AnalyticsEventName>(
  eventName: K,
  params: AnalyticsEventMap[K],
  options?: TrackOnMountOptions
): void {
  const hasTrackedRef = useRef(false);
  const dedupeKey = options?.dedupeKey;
  const dedupeWindowMs = options?.dedupeWindowMs;

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    if (!shouldTrackMountEvent({ dedupeKey, dedupeWindowMs })) {
      hasTrackedRef.current = true;
      return;
    }

    hasTrackedRef.current = true;
    trackEvent(eventName, params);
  }, [dedupeKey, dedupeWindowMs, eventName, params]);
}

function hasFieldErrors(fieldErrors: ActionState['fieldErrors']): boolean {
  return Boolean(fieldErrors && Object.keys(fieldErrors).length > 0);
}

export function useTrackActionFormEvents(form: string, state: ActionState): () => void {
  const submissionCountRef = useRef(0);
  const handledErrorSubmissionRef = useRef(0);

  useEffect(() => {
    if (submissionCountRef.current === 0) {
      return;
    }

    if (handledErrorSubmissionRef.current === submissionCountRef.current) {
      return;
    }

    const validationError = hasFieldErrors(state.fieldErrors);
    const serverError = Boolean(state.error);

    if (state.success || (!validationError && !serverError)) {
      return;
    }

    handledErrorSubmissionRef.current = submissionCountRef.current;

    trackEvent(GA_EVENTS.FORM_ERROR, {
      form,
      error_type: validationError ? 'validation' : 'server',
    });
  }, [form, state.error, state.fieldErrors, state.success]);

  return () => {
    submissionCountRef.current += 1;
    trackEvent(GA_EVENTS.FORM_SUBMIT, { form });
  };
}
