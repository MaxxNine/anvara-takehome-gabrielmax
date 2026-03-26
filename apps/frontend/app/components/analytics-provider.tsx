'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import {
  assignConfiguredVariant,
  getActiveABTests,
  getOrCreateABTestData,
  isValidABTestVariant,
  parseDebugOverrides,
  writeABTestCookie,
} from '@/lib/ab-testing';
import { setAnalyticsUserProperties, useTrackPageView } from '@/lib/analytics';

type AnalyticsProviderProps = {
  children: ReactNode;
};

function isSecureCookieRuntime(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function buildABUserProperties(searchParams: ReturnType<typeof useSearchParams>): Record<string, string> {
  const secure = isSecureCookieRuntime();
  const data = getOrCreateABTestData({ secure });
  const debugOverrides = parseDebugOverrides(searchParams);
  let hasCookieUpdates = false;
  const userProperties: Record<string, string> = {};

  for (const { testName } of getActiveABTests()) {
    const cookieVariant = data.assignments[testName];
    const assignedVariant =
      cookieVariant && isValidABTestVariant(testName, cookieVariant)
        ? cookieVariant
        : assignConfiguredVariant(data.visitorId, testName);

    if (assignedVariant !== cookieVariant) {
      data.assignments[testName] = assignedVariant;
      hasCookieUpdates = true;
    }

    userProperties[`ab_${testName.replace(/-/g, '_')}`] =
      debugOverrides[testName] ?? assignedVariant;
  }

  if (hasCookieUpdates) {
    writeABTestCookie(data, { secure });
  }

  return userProperties;
}

function AnalyticsEffects() {
  useTrackPageView();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userProperties = buildABUserProperties(searchParams);

    if (Object.keys(userProperties).length === 0) {
      return;
    }

    setAnalyticsUserProperties(userProperties);
  }, [searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsEffects />
      </Suspense>
      {children}
    </>
  );
}
