import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  AB_TEST_COOKIE_NAME,
  assignConfiguredVariant,
  createABTestCookieData,
  getActiveABTests,
  isValidABTestVariant,
  parseABTestCookieValue,
  serializeABTestCookie,
} from '@/lib/ab-testing';

function getABTestCookieValue(request: NextRequest): string | undefined {
  return request.cookies.get(AB_TEST_COOKIE_NAME)?.value;
}

function getUpdatedABTestCookieValue(request: NextRequest): string | null {
  const existingData = parseABTestCookieValue(getABTestCookieValue(request));
  const abTestData = existingData ?? createABTestCookieData();
  let hasChanges = existingData === null;

  for (const { testName } of getActiveABTests()) {
    const assignedVariant = abTestData.assignments[testName];

    if (assignedVariant && isValidABTestVariant(testName, assignedVariant)) {
      continue;
    }

    abTestData.assignments[testName] = assignConfiguredVariant(abTestData.visitorId, testName);
    hasChanges = true;
  }

  if (!hasChanges) {
    return null;
  }

  return serializeABTestCookie(abTestData, {
    secure: request.nextUrl.protocol === 'https:',
  });
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookieValue = getUpdatedABTestCookieValue(request);

  if (cookieValue) {
    response.headers.append('Set-Cookie', cookieValue);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
