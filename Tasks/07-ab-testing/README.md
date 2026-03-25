# A/B Testing Infrastructure

## Overview

Cookie-based A/B testing system with deterministic variant assignment via FNV-1a hashing. Variants are assigned server-side in Next.js middleware (on first visit) and persisted in a JSON cookie for 90 days. Both server components and client components can read the assigned variant without layout shift.

**Stack**: Next.js 16.1.3 middleware, React 19 hooks, GA4 custom dimensions, FNV-1a hashing

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  First Request   │────▶│   middleware.ts   │────▶│  Set-Cookie +   │
│  (no cookie)     │     │  assign variants  │     │  x-anvara-ab    │
└─────────────────┘     └──────────────────┘     │  request header │
                                                  └────────┬────────┘
                                                           │
                         ┌─────────────────────────────────┼──────────────────┐
                         │                                 │                  │
                    ┌────▼──────────┐          ┌───────────▼───┐    ┌────────▼────────┐
                    │ Server Comp.  │          │ Client Comp.  │    │  GA4 Analytics   │
                    │ getServerAB   │          │ useABTest()   │    │ variant_assigned │
                    │ Variant()     │          │ hook          │    │ event            │
                    └───────────────┘          └───────────────┘    └─────────────────┘
```

### Assignment Flow

1. **Middleware** (`middleware.ts`): Runs on every navigation request. Reads the `anvara_ab_tests` cookie. If missing or incomplete (new test added), generates a `visitorId` and assigns variants using `fnvHash(visitorId + testName) % totalWeight`. Writes the result as:
   - A `Set-Cookie` response header (persisted for 90 days)
   - An `x-anvara-ab-tests` request header (available to server components in the same request)

2. **Server Components** (`getServerABVariant()`): Reads the forwarded `x-anvara-ab-tests` header (set by middleware) or falls back to the cookie header. No client-side JS needed — zero layout shift.

3. **Client Components** (`useABTest()` hook): Reads the cookie directly from `document.cookie`. If the cookie is missing (edge case), assigns a variant client-side and writes the cookie. Tracks `variant_assigned` events to GA4 for new assignments.

4. **Debug Overrides**: `?ab_force=test-name:B` query parameter forces a specific variant (dev only). Also supports `localStorage.ab_debug = 'true'` for console logging.

### Cookie Structure

```json
{
  "visitorId": "a1b2c3d4e5f67890",
  "assignments": {
    "cta-button-text": "A",
    "home-hero-layout": "B"
  }
}
```

Cookie name: `anvara_ab_tests` | Max-Age: 90 days | SameSite: Lax

---

## Active Experiments

| Test Name | Variants | Weights | Where Used |
|-----------|----------|---------|------------|
| `cta-button-text` | A: "Book This Placement", B: "Get Started Now" | 50/50 | Ad slot detail page — placement request CTA button |
| `home-hero-layout` | A: Default, B: Centered CTA | 70/30 | Home page hero section |

Configured in `apps/frontend/lib/ab-testing/config.ts`. Add new tests by adding entries to `AB_TESTS`.

---

## File Map

All paths relative to `apps/frontend/`.

```
middleware.ts                        — Server-side variant assignment on every request
lib/ab-testing/
├── index.ts                         — Public barrel export
├── config.ts                        — AB_TESTS config, type guards, helpers
├── assignment.ts                    — FNV-1a hash + weighted variant assignment
├── cookies.ts                       — Cookie read/write/parse/serialize
├── hooks.ts                         — useABTest() client hook
├── server.ts                        — getServerABVariant() for server components
└── debug.ts                         — ?ab_force= override, console logging
```

### Usage in Pages

| Page | Method | Test |
|------|--------|------|
| `app/page.tsx` | `getServerABVariant('home-hero-layout')` | Hero layout |
| `app/marketplace/[id]/page.tsx` | `getServerABVariant('cta-button-text')` | CTA text (passed as prop) |
| `app/marketplace/[id]/components/placement-request-form.tsx` | `useABTest('cta-button-text')` | CTA text (client hydration) |

---

## Analytics Integration

- **Event**: `variant_assigned` — fired on new assignments (not cookie reads)
- **Custom dimensions** (event-scoped, registered in GA4 admin):
  - `test_name` — experiment identifier
  - `variant` — assigned variant ID (A/B)
  - `source` — how variant was determined (`new_assignment`, `forced`, `cookie`)
- **Custom user property**: `ab_test_group` — set via `setAnalyticsUserProperties`

This allows filtering any GA4 report by experiment variant to measure conversion differences.

---

## How to Test Variants

1. **Force via URL**: `?ab_force=cta-button-text:B` or `?ab_force=home-hero-layout:B`
2. **Force multiple**: `?ab_force=cta-button-text:B,home-hero-layout:A`
3. **Clear assignment**: Delete the `anvara_ab_tests` cookie in DevTools → Application → Cookies
4. **Enable debug logging**: In browser console: `localStorage.ab_debug = 'true'`, then refresh
5. **Verify in GA4**: Realtime → filter by `variant_assigned` event → check `test_name` and `variant` dimensions

---

## Design Decisions

### 1. Middleware-first assignment (not client-side only)

**Decision**: Assign variants in Next.js middleware before the request reaches any component.

**Why**: Server components need the variant at render time. If assignment only happened client-side, server-rendered content would always show the default variant, causing a flash when the client hydrates with a different variant. Middleware ensures consistency across server and client from the first render.

### 2. FNV-1a hash (not Math.random)

**Decision**: Deterministic hash of `visitorId:testName` instead of random assignment.

**Why**: Given the same visitor ID, the same variant is always assigned. This means:
- Re-assignment after cookie expiry gives the same variant (consistent experience)
- No need for server-side storage of assignments
- Easy to reason about and test

### 3. Cookie-based (not database-backed)

**Decision**: Store assignments in a browser cookie, not in the database.

**Why**: A/B test assignment must happen before authentication (landing page, marketplace). Cookie-based assignment works for anonymous visitors, requires zero backend infrastructure, and the deterministic hash means cookie loss is recoverable.

### 4. Weighted variants (not just 50/50)

**Decision**: Each variant has a `weight` field, assignment uses weighted buckets.

**Why**: Allows gradual rollouts (e.g., 90/10 for risky changes) and unequal splits. The `home-hero-layout` test uses 70/30 to limit exposure of the new layout.
