'use client';

import type { ReactNode } from 'react';

import { useTrackPageView } from '@/lib/analytics';

type AnalyticsProviderProps = {
  children: ReactNode;
};

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useTrackPageView();
  return <>{children}</>;
}
