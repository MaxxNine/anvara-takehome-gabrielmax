import { generateVisitorId } from './assignment';

export const AB_TEST_COOKIE_NAME = 'anvara_ab_tests';
export const AB_TEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
export const AB_TEST_REQUEST_HEADER = 'x-anvara-ab-tests';

export type ABTestAssignments = Record<string, string>;

export type ABTestCookieData = {
  assignments: ABTestAssignments;
  visitorId: string;
};

type SerializeABTestCookieOptions = {
  secure?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getCookieValue(cookieHeader: string, cookieName: string): string | null {
  const cookiePrefix = `${cookieName}=`;

  for (const part of cookieHeader.split(';')) {
    const trimmedPart = part.trim();

    if (trimmedPart.startsWith(cookiePrefix)) {
      return trimmedPart.slice(cookiePrefix.length);
    }
  }

  return null;
}

function parseAssignments(value: unknown): ABTestAssignments | null {
  if (!isRecord(value)) {
    return null;
  }

  const assignments: ABTestAssignments = {};

  for (const [testName, variant] of Object.entries(value)) {
    if (typeof variant !== 'string') {
      return null;
    }

    assignments[testName] = variant;
  }

  return assignments;
}

export function parseABTestCookieValue(cookieValue: string | null | undefined): ABTestCookieData | null {
  if (!cookieValue) {
    return null;
  }

  try {
    const decodedValue = decodeURIComponent(cookieValue);
    const parsedValue: unknown = JSON.parse(decodedValue);

    if (!isRecord(parsedValue) || typeof parsedValue.visitorId !== 'string') {
      return null;
    }

    const assignments = parseAssignments(parsedValue.assignments);

    if (!assignments) {
      return null;
    }

    return {
      assignments,
      visitorId: parsedValue.visitorId,
    };
  } catch {
    return null;
  }
}

export function readABTestCookieFromString(cookieHeader: string | null | undefined): ABTestCookieData | null {
  if (!cookieHeader) {
    return null;
  }

  return parseABTestCookieValue(getCookieValue(cookieHeader, AB_TEST_COOKIE_NAME));
}

export function createABTestCookieData(
  visitorId = generateVisitorId(),
  assignments: ABTestAssignments = {}
): ABTestCookieData {
  return {
    assignments: { ...assignments },
    visitorId,
  };
}

export function serializeABTestCookieValue(data: ABTestCookieData): string {
  return encodeURIComponent(JSON.stringify(data));
}

export function serializeABTestCookie(
  data: ABTestCookieData,
  options: SerializeABTestCookieOptions = {}
): string {
  const cookieParts = [
    `${AB_TEST_COOKIE_NAME}=${serializeABTestCookieValue(data)}`,
    `Max-Age=${AB_TEST_COOKIE_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
  ];

  if (options.secure) {
    cookieParts.push('Secure');
  }

  return cookieParts.join('; ');
}

export function readABTestCookie(): ABTestCookieData | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return readABTestCookieFromString(document.cookie);
}

export function writeABTestCookie(
  data: ABTestCookieData,
  options: SerializeABTestCookieOptions = {}
): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = serializeABTestCookie(data, options);
}

export function getOrCreateABTestData(
  options: SerializeABTestCookieOptions = {}
): ABTestCookieData {
  const existingData = readABTestCookie();

  if (existingData) {
    return existingData;
  }

  const newData = createABTestCookieData();
  writeABTestCookie(newData, options);
  return newData;
}
