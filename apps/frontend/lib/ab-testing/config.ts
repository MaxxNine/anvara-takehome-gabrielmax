export type ABTestVariant = {
  id: string;
  label: string;
  weight: number;
};

export type ABTestConfig = {
  isActive: boolean;
  name: string;
  variants: readonly ABTestVariant[];
};

export const AB_TESTS = {
  'cta-button-text': {
    name: 'CTA Button Text',
    variants: [
      { id: 'A', label: 'Book This Placement', weight: 50 },
      { id: 'B', label: 'Get Started Now', weight: 50 },
    ],
    isActive: true,
  },
  'home-hero-layout': {
    name: 'Home Hero Layout',
    variants: [
      { id: 'A', label: 'Default', weight: 70 },
      { id: 'B', label: 'Centered CTA', weight: 30 },
    ],
    isActive: true,
  },
} as const satisfies Record<string, ABTestConfig>;

export type ABTestName = keyof typeof AB_TESTS;

type ABTestEntry = {
  config: (typeof AB_TESTS)[ABTestName];
  testName: ABTestName;
};

export function isABTestName(value: string): value is ABTestName {
  return value in AB_TESTS;
}

export function getABTest(testName: ABTestName): (typeof AB_TESTS)[ABTestName] {
  return AB_TESTS[testName];
}

export function getActiveABTests(): ABTestEntry[] {
  return (Object.entries(AB_TESTS) as [ABTestName, (typeof AB_TESTS)[ABTestName]][])
    .filter(([, config]) => config.isActive)
    .map(([testName, config]) => ({ testName, config }));
}

export function getDefaultABTestVariant(testName: ABTestName): string {
  return AB_TESTS[testName].variants[0]?.id ?? 'A';
}

export function isValidABTestVariant(testName: ABTestName, variantId: string): boolean {
  return AB_TESTS[testName].variants.some((variant) => variant.id === variantId);
}
