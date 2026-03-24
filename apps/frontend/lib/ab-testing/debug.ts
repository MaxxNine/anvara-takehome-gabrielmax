import { isABTestName, isValidABTestVariant, type ABTestName } from './config';

export const AB_FORCE_QUERY_PARAM = 'ab_force';

export type ABTestVariantSource =
  | 'cookie'
  | 'default'
  | 'forced'
  | 'initial_variant'
  | 'new_assignment';

type SearchParamsLike = {
  get(name: string): string | null;
};

function parseOverrideEntry(entry: string): [string, string] | null {
  const separatorIndex = entry.indexOf(':');

  if (separatorIndex <= 0 || separatorIndex >= entry.length - 1) {
    return null;
  }

  const testName = entry.slice(0, separatorIndex).trim();
  const variantId = entry.slice(separatorIndex + 1).trim();

  if (!testName || !variantId) {
    return null;
  }

  return [testName, variantId];
}

function canUseDebugRuntime(): boolean {
  return typeof window !== 'undefined' && process.env.NODE_ENV !== 'production';
}

export function parseDebugOverrides(
  searchParams: SearchParamsLike | null | undefined
): Partial<Record<ABTestName, string>> {
  const rawOverrides = searchParams?.get(AB_FORCE_QUERY_PARAM);

  if (!rawOverrides) {
    return {};
  }

  const overrides: Partial<Record<ABTestName, string>> = {};

  for (const entry of rawOverrides.split(',')) {
    const parsedEntry = parseOverrideEntry(entry);

    if (!parsedEntry) {
      continue;
    }

    const [testName, variantId] = parsedEntry;

    if (!isABTestName(testName) || !isValidABTestVariant(testName, variantId)) {
      continue;
    }

    overrides[testName] = variantId;
  }

  return overrides;
}

export function getForcedABTestVariant(
  testName: ABTestName,
  searchParams: SearchParamsLike | null | undefined
): string | null {
  return parseDebugOverrides(searchParams)[testName] ?? null;
}

export function isABTestDebugMode(): boolean {
  if (!canUseDebugRuntime()) {
    return false;
  }

  try {
    return window.localStorage.getItem('ab_debug') === 'true';
  } catch {
    return false;
  }
}

export function logABTestAssignment(
  testName: ABTestName,
  variant: string,
  source: ABTestVariantSource
): void {
  if (!isABTestDebugMode()) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`[ab-test] ${testName} -> ${variant} (${source})`);
}
