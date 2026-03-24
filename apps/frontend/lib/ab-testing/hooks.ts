'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { GA_EVENTS, trackEvent } from '../analytics';
import { assignConfiguredVariant } from './assignment';
import { getABTest, getDefaultABTestVariant, isValidABTestVariant, type ABTestName } from './config';
import {
  getOrCreateABTestData,
  readABTestCookie,
  writeABTestCookie,
} from './cookies';
import { getForcedABTestVariant, logABTestAssignment, type ABTestVariantSource } from './debug';

function isSecureCookieRuntime(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function getStoredVariant(testName: ABTestName): string | null {
  const cookieVariant = readABTestCookie()?.assignments[testName];

  if (!cookieVariant || !isValidABTestVariant(testName, cookieVariant)) {
    return null;
  }

  return cookieVariant;
}

function getInitialVariant(testName: ABTestName, initialVariant?: string): string | null {
  if (!initialVariant || !isValidABTestVariant(testName, initialVariant)) {
    return null;
  }

  return initialVariant;
}

function resolveClientVariant(
  testName: ABTestName,
  initialVariant?: string
): { source: ABTestVariantSource; variant: string } {
  const test = getABTest(testName);

  if (!test.isActive) {
    return {
      source: 'default',
      variant: getDefaultABTestVariant(testName),
    };
  }

  const storedVariant = getStoredVariant(testName);

  if (storedVariant) {
    return {
      source: 'cookie',
      variant: storedVariant,
    };
  }

  const providedInitialVariant = getInitialVariant(testName, initialVariant);
  const data = getOrCreateABTestData({ secure: isSecureCookieRuntime() });

  if (providedInitialVariant) {
    data.assignments[testName] = providedInitialVariant;
    writeABTestCookie(data, { secure: isSecureCookieRuntime() });

    return {
      source: 'initial_variant',
      variant: providedInitialVariant,
    };
  }

  const assignedVariant = assignConfiguredVariant(data.visitorId, testName);
  data.assignments[testName] = assignedVariant;
  writeABTestCookie(data, { secure: isSecureCookieRuntime() });

  return {
    source: 'new_assignment',
    variant: assignedVariant,
  };
}

export function useABTest(testName: ABTestName, initialVariant?: string): string {
  const searchParams = useSearchParams();
  const test = getABTest(testName);
  const forcedVariant = useMemo(
    () => getForcedABTestVariant(testName, searchParams),
    [searchParams, testName]
  );
  const lastLoggedRef = useRef<string | null>(null);
  const lastTrackedEventRef = useRef<string | null>(null);
  const [variant, setVariant] = useState(() => {
    if (!test.isActive) {
      return getDefaultABTestVariant(testName);
    }

    return forcedVariant ?? getStoredVariant(testName) ?? getInitialVariant(testName, initialVariant) ?? getDefaultABTestVariant(testName);
  });

  useEffect(() => {
    if (!test.isActive) {
      const defaultVariant = getDefaultABTestVariant(testName);
      setVariant(defaultVariant);
      return;
    }

    if (forcedVariant) {
      setVariant(forcedVariant);

      const logKey = `${forcedVariant}:forced`;

      if (lastLoggedRef.current !== logKey) {
        lastLoggedRef.current = logKey;
        logABTestAssignment(testName, forcedVariant, 'forced');
      }

      const trackKey = `${forcedVariant}:forced`;

      if (lastTrackedEventRef.current !== trackKey) {
        lastTrackedEventRef.current = trackKey;
        trackEvent(GA_EVENTS.VARIANT_ASSIGNED, {
          source: 'forced',
          test_name: testName,
          variant: forcedVariant,
        });
      }

      return;
    }

    const resolvedVariant = resolveClientVariant(testName, initialVariant);
    setVariant(resolvedVariant.variant);

    const logKey = `${resolvedVariant.variant}:${resolvedVariant.source}`;

    if (lastLoggedRef.current !== logKey) {
      lastLoggedRef.current = logKey;
      logABTestAssignment(testName, resolvedVariant.variant, resolvedVariant.source);
    }

    if (resolvedVariant.source === 'new_assignment') {
      const trackKey = `${resolvedVariant.variant}:new_assignment`;

      if (lastTrackedEventRef.current !== trackKey) {
        lastTrackedEventRef.current = trackKey;
        trackEvent(GA_EVENTS.VARIANT_ASSIGNED, {
          source: 'new_assignment',
          test_name: testName,
          variant: resolvedVariant.variant,
        });
      }
    }
  }, [forcedVariant, initialVariant, test, testName]);

  return forcedVariant ?? variant;
}
