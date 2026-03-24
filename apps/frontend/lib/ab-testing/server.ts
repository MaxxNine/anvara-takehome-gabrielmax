import 'server-only';

import { headers } from 'next/headers';

import { assignConfiguredVariant } from './assignment';
import { getABTest, getDefaultABTestVariant, isValidABTestVariant, type ABTestName } from './config';
import { readABTestCookieFromString, type ABTestCookieData } from './cookies';

function getStoredVariant(testName: ABTestName, data: ABTestCookieData | null): string | null {
  const variant = data?.assignments[testName];

  if (!variant || !isValidABTestVariant(testName, variant)) {
    return null;
  }

  return variant;
}

export async function getServerABTestData(): Promise<ABTestCookieData | null> {
  const requestHeaders = await headers();
  return readABTestCookieFromString(requestHeaders.get('cookie'));
}

type GetServerABVariantOptions = {
  forcedVariant?: string | null;
};

export async function getServerABVariant(
  testName: ABTestName,
  options: GetServerABVariantOptions = {}
): Promise<string> {
  const test = getABTest(testName);

  if (!test.isActive) {
    return getDefaultABTestVariant(testName);
  }

  if (options.forcedVariant && isValidABTestVariant(testName, options.forcedVariant)) {
    return options.forcedVariant;
  }

  const cookieData = await getServerABTestData();
  const storedVariant = getStoredVariant(testName, cookieData);

  if (storedVariant) {
    return storedVariant;
  }

  if (cookieData?.visitorId) {
    return assignConfiguredVariant(cookieData.visitorId, testName);
  }

  return getDefaultABTestVariant(testName);
}
