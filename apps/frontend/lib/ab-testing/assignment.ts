import { AB_TESTS, type ABTestName, type ABTestVariant } from './config';

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
const VISITOR_ID_BYTES = 8;

function getTotalVariantWeight(variants: readonly ABTestVariant[]): number {
  return variants.reduce((totalWeight, variant) => {
    const normalizedWeight = Math.max(0, Math.trunc(variant.weight));
    return totalWeight + normalizedWeight;
  }, 0);
}

export function fnvHash(input: string): number {
  let hash = FNV_OFFSET_BASIS;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }

  return hash >>> 0;
}

export function assignVariant(
  visitorId: string,
  testName: string,
  variants: readonly ABTestVariant[]
): string {
  if (variants.length === 0) {
    throw new Error(`Cannot assign a variant for "${testName}" without any configured variants.`);
  }

  const totalWeight = getTotalVariantWeight(variants);

  if (totalWeight <= 0) {
    throw new Error(`Cannot assign a variant for "${testName}" without a positive total weight.`);
  }

  const bucket = fnvHash(`${visitorId}:${testName}`) % totalWeight;
  let cumulativeWeight = 0;

  for (const variant of variants) {
    cumulativeWeight += Math.max(0, Math.trunc(variant.weight));

    if (bucket < cumulativeWeight) {
      return variant.id;
    }
  }

  return variants[variants.length - 1].id;
}

export function assignConfiguredVariant(visitorId: string, testName: ABTestName): string {
  return assignVariant(visitorId, testName, AB_TESTS[testName].variants);
}

export function generateVisitorId(): string {
  const bytes = new Uint8Array(VISITOR_ID_BYTES);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
