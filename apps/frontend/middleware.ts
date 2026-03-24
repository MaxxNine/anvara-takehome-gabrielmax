import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  AB_TEST_COOKIE_NAME,
  type ABTestCookieData,
  assignConfiguredVariant,
  createABTestCookieData,
  getActiveABTests,
  isValidABTestVariant,
  parseABTestCookieValue,
  serializeABTestCookie,
  serializeABTestCookieValue,
} from '@/lib/ab-testing';

function getABTestCookieValue(request: NextRequest): string | undefined {
  return request.cookies.get(AB_TEST_COOKIE_NAME)?.value;
}

function upsertRequestCookieHeader(
  cookieHeader: string | null,
  cookieName: string,
  cookieValue: string
): string {
  const existingParts = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .filter(Boolean) ?? [];

  const filteredParts = existingParts.filter((part) => !part.startsWith(`${cookieName}=`));
  filteredParts.push(`${cookieName}=${cookieValue}`);
  return filteredParts.join('; ');
}

type UpdatedABTestCookie = {
  data: ABTestCookieData;
  setCookieHeader: string;
};

function getUpdatedABTestCookie(request: NextRequest): UpdatedABTestCookie | null {
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

  return {
    data: abTestData,
    setCookieHeader: serializeABTestCookie(abTestData, {
      secure: request.nextUrl.protocol === 'https:',
    }),
  };
}

export function middleware(request: NextRequest) {
  const updatedCookie = getUpdatedABTestCookie(request);
  const requestHeaders = new Headers(request.headers);

  if (updatedCookie) {
    requestHeaders.set(
      'cookie',
      upsertRequestCookieHeader(
        request.headers.get('cookie'),
        AB_TEST_COOKIE_NAME,
        serializeABTestCookieValue(updatedCookie.data)
      )
    );
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (updatedCookie) {
    response.headers.append('Set-Cookie', updatedCookie.setCookieHeader);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
