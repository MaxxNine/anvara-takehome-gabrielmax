# Bonus Challenge 03 — A/B Testing Implementation

## Context

Challenges 01 (GA4) and 02 (Conversion Tracking) provide analytics infrastructure. This challenge adds a cookie-based A/B testing framework with server-side middleware assignment, a `useABTest` hook, weighted splits, debug mode, and GA4 integration — all without external service accounts.

**Depends on**: Challenge 01 (GA4 Setup), Challenge 02 (Conversion Tracking)

---

## Architecture Decisions

### 1. Cookie-based with Next.js middleware for server-side assignment

A single JSON cookie (`anvara_ab_tests`) stores `{ visitorId, assignments }`. Middleware reads/creates this cookie at the edge before the page renders — eliminating flash of default content (FODC). The client-side hook reads the same cookie, so variant is available immediately on first render.

**Why not localStorage?** Not readable server-side. Can't use in middleware. Different tabs could get different variants during the assignment window.

**Why not a database?** Adds backend complexity for no benefit. Cookie persistence (90 days) is sufficient for A/B testing. The challenge explicitly says "no external account required."

### 2. Single JSON cookie for all tests

One cookie (`anvara_ab_tests`) with structure:
```json
{
  "visitorId": "a1b2c3d4e5f6g7h8",
  "assignments": {
    "cta-button-text": "A",
    "home-hero-layout": "B"
  }
}
```

**Why not one cookie per test?** Fewer cookies = smaller HTTP headers. Single parse gives access to all assignments. Adding/removing tests doesn't change cookie management.

### 3. Deterministic hash (FNV-1a) for weighted variant selection

`hash(visitorId + testName) % totalWeight` maps to a weighted variant. Same visitor always gets the same variant for a given test.

**Why not `Math.random()`?** Random assignment means clearing cookies gives a potentially different variant. With a hash, the same `visitorId` always maps to the same variant. The `visitorId` is the random element — generated once and persisted.

FNV-1a is a well-known, fast, non-cryptographic hash. ~15 lines of pure JavaScript, no dependencies, Edge Runtime compatible.

### 4. `useABTest(testName)` as the primary API

```tsx
const variant = useABTest('cta-button-text');
return <button>{variant === 'A' ? 'Book This Placement' : 'Get Started Now'}</button>;
```

The hook:
- Returns variant ID string (`'A'`, `'B'`, etc.)
- Is stable for the component's lifetime (memoized from cookie)
- Fires `variant_assigned` analytics event on first assignment
- Returns `'A'` (default) for unknown/inactive tests

### 5. Test config as typed constants

```ts
export const AB_TESTS = {
  'cta-button-text': {
    name: 'CTA Button Text',
    variants: [
      { id: 'A', label: 'Book This Placement', weight: 50 },
      { id: 'B', label: 'Get Started Now', weight: 50 },
    ],
    isActive: true,
  },
};
```

Adding a test = adding one object. Supports weighted splits (70/30, 50/25/25, etc.). `isActive: false` disables a test without removing config.

### 6. Debug mode via URL parameter

`?ab_force=cta-button-text:B` overrides normal assignment for that page load. Shareable (QA can send a link forcing a variant). `localStorage.ab_debug=true` enables console logging of all assignments.

### 7. GA4 user properties for variant slicing

`AnalyticsProvider` sets `gtag('set', 'user_properties', { ab_cta_button_text: 'A' })` for each active test. This tags every subsequent GA4 event with variant info, enabling per-variant analysis of any metric.

---

## Implementation

### New Files

#### `apps/frontend/lib/ab-testing/config.ts` (~60 lines)

Types and test definitions:
```ts
type ABTestVariant = { id: string; label: string; weight: number };
type ABTestConfig = { name: string; variants: ABTestVariant[]; isActive: boolean };

export const AB_TESTS: Record<string, ABTestConfig> = {
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
};
```

#### `apps/frontend/lib/ab-testing/assignment.ts` (~80 lines)

Core assignment logic:
- `fnvHash(input: string): number` — FNV-1a hash, ~15 lines, pure function
- `assignVariant(visitorId: string, testName: string, variants: ABTestVariant[]): string`
  - Hashes `visitorId + testName`
  - Maps hash to weighted variant via cumulative weight walk
  - Returns variant `id`
- `generateVisitorId(): string` — random 16-char hex via `crypto.getRandomValues`

All functions are Edge Runtime compatible (no Node.js APIs).

#### `apps/frontend/lib/ab-testing/cookies.ts` (~70 lines)

Cookie read/write:
- `COOKIE_NAME = 'anvara_ab_tests'`
- `COOKIE_MAX_AGE = 60 * 60 * 24 * 90` (90 days)
- `type ABTestCookieData = { visitorId: string; assignments: Record<string, string> }`
- `readABTestCookie(): ABTestCookieData | null` — parses `document.cookie`
- `writeABTestCookie(data: ABTestCookieData): void` — sets with `path=/; SameSite=Lax; max-age=...`
- `getOrCreateABTestData(): ABTestCookieData` — reads or creates with fresh `visitorId`

#### `apps/frontend/lib/ab-testing/hooks.ts` (~70 lines)

React hooks:
- `useABTest(testName: string): string`
  1. Reads cookie data via `useState` (initialized from cookie)
  2. Checks `AB_TESTS[testName]` exists and `isActive`; returns `'A'` if not
  3. Checks debug override: `?ab_force=testName:variant` via `useSearchParams()`
  4. If already assigned in cookie → return it
  5. If not → `assignVariant()`, update cookie, fire `trackEvent('variant_assigned', { test_name, variant })`
  6. Return variant ID

#### `apps/frontend/lib/ab-testing/debug.ts` (~30 lines)

Debug utilities:
- `parseDebugOverrides(searchParams: URLSearchParams): Record<string, string>` — parses `?ab_force=test1:A,test2:B`
- `isDebugMode(): boolean` — checks `localStorage.getItem('ab_debug') === 'true'`
- `logVariantAssignment(testName, variant, source)` — console.log in debug mode only

#### `apps/frontend/lib/ab-testing/index.ts` (~5 lines)

Barrel export: `useABTest`, `AB_TESTS`, types.

#### `apps/frontend/middleware.ts` (~50 lines)

Server-side variant assignment at the edge:
- Reads `anvara_ab_tests` cookie from `NextRequest`
- If no cookie → generates `visitorId`, assigns all active tests
- If cookie exists but missing assignments for new tests → assigns those
- Sets updated cookie on `NextResponse`
- `matcher` config excludes `_next/static`, `_next/image`, `api/`, `favicon.ico`

**Why middleware?** Without it, the client hook assigns on hydration — the user briefly sees the default variant before it switches. Middleware assigns before the page renders, so `useABTest` returns the correct variant on first paint.

### Modified Files

#### `apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx`

Primary A/B test integration point:
- Import `useABTest` from `@/lib/ab-testing`
- `const ctaVariant = useABTest('cta-button-text')`
- Replace hardcoded "Book This Placement" button text:
  ```tsx
  {booking ? 'Booking...' : ctaVariant === 'B' ? 'Get Started Now' : 'Book This Placement'}
  ```
- Include `cta_variant: ctaVariant` in `placement_request` event params

#### `apps/frontend/app/page.tsx`

- Import `useABTest` from `@/lib/ab-testing`
- `const heroVariant = useABTest('home-hero-layout')`
- Apply variant B layout changes (e.g., centered CTA, different heading text)

#### `apps/frontend/app/components/analytics-provider.tsx`

- After `useTrackPageView()`, read AB test cookie and set GA4 user properties:
  ```ts
  const abData = readABTestCookie();
  if (abData && window.gtag) {
    const properties: Record<string, string> = {};
    for (const [test, variant] of Object.entries(abData.assignments)) {
      properties[`ab_${test.replace(/-/g, '_')}`] = variant;
    }
    window.gtag('set', 'user_properties', properties);
  }
  ```

#### `.env.example`

- Add comment: `# A/B Testing: No env vars needed — config is in lib/ab-testing/config.ts`

---

## File Map

```
apps/frontend/
├── lib/
│   └── ab-testing/
│       ├── index.ts          — barrel exports
│       ├── config.ts         — test definitions, types
│       ├── assignment.ts     — FNV hash, weighted variant selection
│       ├── cookies.ts        — cookie read/write
│       ├── hooks.ts          — useABTest() hook
│       └── debug.ts          — debug utilities
├── middleware.ts              — edge variant assignment
├── app/
│   ├── components/
│   │   └── analytics-provider.tsx  — [modified] sets GA4 user properties
│   ├── page.tsx                    — [modified] hero layout variant
│   └── marketplace/
│       └── [id]/components/
│           └── ad-slot-detail.tsx  — [modified] CTA text variant
```

---

## Example Usage

### Adding a new test

1. Add config to `lib/ab-testing/config.ts`:
   ```ts
   'pricing-display': {
     name: 'Pricing Display Format',
     variants: [
       { id: 'A', label: 'Monthly', weight: 50 },
       { id: 'B', label: 'Annual with savings', weight: 50 },
     ],
     isActive: true,
   },
   ```

2. Use in component:
   ```tsx
   const variant = useABTest('pricing-display');
   return variant === 'B'
     ? <span>${annual}/year (save 20%)</span>
     : <span>${monthly}/month</span>;
   ```

That's it. Middleware handles assignment, cookie persists it, analytics tracks it.

### Forcing a variant for QA

```
https://localhost:3000/marketplace/abc123?ab_force=cta-button-text:B
```

### Enabling debug logging

```js
localStorage.setItem('ab_debug', 'true');
```

---

## Verification

1. Visit `/marketplace/:id` → CTA shows either "Book This Placement" or "Get Started Now"
2. Refresh multiple times → same variant persists (cookie)
3. Open incognito window → may get a different variant (new `visitorId`)
4. Add `?ab_force=cta-button-text:B` → forces variant B regardless of cookie
5. DevTools → Application → Cookies → verify `anvara_ab_tests` contains JSON with `visitorId` and `assignments`
6. Delete cookie + refresh → new assignment created
7. DevTools → Network → verify `variant_assigned` event fires with test name and variant
8. Verify subsequent GA events include variant user properties
9. Set `localStorage.ab_debug=true` → console shows assignment logs
10. `pnpm --filter @anvara/frontend typecheck` passes
11. `pnpm --filter @anvara/frontend lint` passes
