# Challenge 03 A/B Testing Implementation Plan

## Chosen Approach

Use Option B: cookie-based A/B test assignment in Next middleware, with deterministic weighted assignment and no external experiment service.

This is the right fit for the current codebase because it:

- keeps assignment server-side on first request, so there is no flash of the default variant
- works with the existing server-first frontend architecture
- fits the current GA4 and conversion-tracking stack without adding backend persistence
- keeps the implementation self-contained inside `apps/frontend`

## Goal

Add a clean A/B testing foundation that supports:

- deterministic visitor assignment
- weighted splits
- persistent cookie-based variants
- debug overrides for QA
- GA4 variant attribution
- small, explicit integration points in the UI

## Current State

- `apps/frontend/app/layout.tsx` already wraps the app with `AnalyticsProvider` and GA4.
- `apps/frontend/app/components/analytics-provider.tsx` currently only tracks SPA `page_view`.
- `apps/frontend/app/page.tsx` is still a server component and should remain server-first.
- `apps/frontend/app/components/home-cta-link.tsx` already owns the tracked home CTA.
- `apps/frontend/app/marketplace/[id]/components/placement-request-form.tsx` owns the marketplace booking CTA text and placement events.
- There is no `apps/frontend/middleware.ts` yet.
- The analytics layer already has a typed event map in `apps/frontend/lib/analytics/events.ts`.

## Architecture Principles

- Keep assignment logic centralized in middleware and shared A/B utilities.
- Keep experiment config typed and local to the frontend app.
- Do not turn server components into client components just to read a variant.
- Keep client hooks for client leaves only.
- Treat forced variants as QA/debug behavior, not as persisted production assignment.
- Do not use the A/B cookie for anything security-sensitive or business-critical.

## Target Architecture

### 1. Middleware owns assignment

`apps/frontend/middleware.ts` should:

- read the `anvara_ab_tests` cookie
- create a `visitorId` if missing
- backfill assignments for active tests that do not yet exist in the cookie
- persist the updated cookie on the response
- avoid touching `_next`, static assets, images, and API routes

This keeps assignments ready before React renders.

### 2. Shared A/B domain module

Create `apps/frontend/lib/ab-testing/` with pure, typed utilities:

- `config.ts`
  - test config, types, active flags, weights
- `assignment.ts`
  - deterministic FNV-1a hash
  - weighted variant selection
  - visitor id generation
- `cookies.ts`
  - cookie name, shape, parse/serialize helpers
  - browser-safe cookie helpers
- `server.ts`
  - read assignments from `next/headers`
  - server helper such as `getServerABVariant(testName)`
- `hooks.ts`
  - `useABTest(testName, initialVariant?)`
  - optional client-only fallback for leaves that cannot get a server-provided variant
- `debug.ts`
  - parse `?ab_force=test:variant`
  - debug logging guard via `localStorage.ab_debug`
- `index.ts`
  - barrel exports

### 3. Server-first variant access

The generic challenge brief suggests using `useABTest()` directly inside `app/page.tsx`, but that would pull a server page into client mode.

For this repo, the cleaner plan is:

- use middleware to ensure assignments already exist
- read variants in server components through `getServerABVariant(...)`
- pass the chosen variant into small presentational or client leaf components
- use `useABTest(...)` only in existing client boundaries when that is actually needed

This preserves the server-first direction established in the recent refactor.

### 4. Analytics integration

Extend the current analytics system in `apps/frontend/lib/analytics/events.ts` with:

- `variant_assigned`

Suggested payload:

```ts
{
  test_name: string;
  variant: string;
  source: 'cookie' | 'new_assignment' | 'forced';
}
```

Analytics behavior:

- fire `variant_assigned` only when a new persisted assignment is created or when a forced override is explicitly being debugged
- set GA4 user properties for active assignments in `AnalyticsProvider`
- attach experiment metadata to relevant conversion events where it improves analysis, starting with the marketplace placement CTA

### 5. Debug behavior

Support:

- `?ab_force=cta-button-text:B`
- optional multi-test syntax like `?ab_force=test-a:A,test-b:B`
- `localStorage.ab_debug=true`

Rules:

- forced variants should override rendering for that request/session view
- forced variants should not silently rewrite the persisted cookie
- debug logging should stay development-only in practice and remain opt-in

## Proposed File Map

### New files

- `apps/frontend/lib/ab-testing/config.ts`
- `apps/frontend/lib/ab-testing/assignment.ts`
- `apps/frontend/lib/ab-testing/cookies.ts`
- `apps/frontend/lib/ab-testing/server.ts`
- `apps/frontend/lib/ab-testing/hooks.ts`
- `apps/frontend/lib/ab-testing/debug.ts`
- `apps/frontend/lib/ab-testing/index.ts`
- `apps/frontend/middleware.ts`

### Modified files

- `apps/frontend/app/components/analytics-provider.tsx`
- `apps/frontend/lib/analytics/events.ts`
- `apps/frontend/app/page.tsx`
- `apps/frontend/app/components/home-cta-link.tsx`
- `apps/frontend/app/marketplace/[id]/components/placement-request-form.tsx`
- `.env.example`

### Likely new UI helpers

To avoid bloating existing files:

- `apps/frontend/app/components/home-hero-experiment.tsx`
- or `apps/frontend/app/components/home-hero.tsx`

This lets `app/page.tsx` stay thin while making the hero experiment explicit.

## Planned Experiments

### `cta-button-text`

Purpose:

- test the marketplace booking CTA copy

Integration point:

- `apps/frontend/app/marketplace/[id]/components/placement-request-form.tsx`

Variants:

- `A`: `Book This Placement`
- `B`: `Get Started Now`

### `home-hero-layout`

Purpose:

- test the home-page hero presentation

Integration point:

- server-rendered home page composition in `apps/frontend/app/page.tsx`

Variants:

- `A`: current simple layout
- `B`: revised hero emphasis and CTA arrangement

## Phases

## Phase 1: Core A/B infrastructure

1. Add typed test config and cookie schema.
2. Add deterministic weighted assignment helpers.
3. Add server and browser cookie utilities.
4. Add middleware that creates or backfills assignments.

Success criteria:

- first request gets a stable `visitorId`
- active tests have assignments before the page renders
- assignments persist across refreshes

## Phase 2: Variant access APIs

1. Add `getServerABVariant(testName)` for server components.
2. Add `useABTest(testName, initialVariant?)` for client leaves.
3. Add debug override parsing and logging helpers.

Success criteria:

- server pages can render variants without becoming client components
- client leaves can consume the same assignment without recomputing it
- debug overrides are explicit and contained

## Phase 3: Analytics integration

1. Add `variant_assigned` to the typed analytics event map.
2. Update `AnalyticsProvider` to set GA4 user properties from assignments.
3. Add variant metadata to relevant conversion events where it helps analysis.

Recommended first event enrichment:

- marketplace placement CTA events should include the CTA variant

Success criteria:

- experiment slices are visible in GA4
- assignment analytics remain typed and centralized

## Phase 4: UI rollout

1. Integrate `cta-button-text` into `placement-request-form.tsx`.
2. Integrate `home-hero-layout` into the home page through a thin server-first component split.
3. Keep existing tracking flows intact while adding experiment metadata.

Success criteria:

- variants render correctly on first paint
- booking flow remains readable and unchanged apart from text/layout variation
- home page remains server-first

## Phase 5: Verification

1. Verify cookie creation and persistence.
2. Verify the same visitor keeps the same variants across refreshes.
3. Verify forced variants via `ab_force`.
4. Verify GA debug output or debug sink captures `variant_assigned`.
5. Verify subsequent analytics events carry the expected user properties and variant metadata.
6. Run frontend `typecheck` and `lint`.

## Verification Checklist

- visit marketplace detail and confirm the CTA variant is stable across refreshes
- open an incognito window and confirm a different visitor can get a different variant
- inspect the `anvara_ab_tests` cookie in DevTools
- delete the cookie and confirm a new assignment is created
- force `?ab_force=cta-button-text:B` and confirm the CTA changes immediately
- confirm `AnalyticsProvider` sets `ab_*` GA4 user properties
- confirm `variant_assigned` is emitted for real new assignments
- confirm `page_view`, placement, and form events still work after the experiment layer is added

## Risks And Guardrails

- Do not move `app/page.tsx` to client mode just to read a test variant.
- Do not duplicate assignment logic between middleware and hooks.
- Do not let forced debug variants overwrite the persisted experiment cookie.
- Keep cookie size small by storing only `visitorId` and assignment ids.
- Validate forced variant ids against configured variants before using them.

## Recommended Execution Order

1. Add `lib/ab-testing` core modules.
2. Add middleware assignment and cookie persistence.
3. Add server/client read APIs.
4. Extend analytics for `variant_assigned` and user properties.
5. Integrate the marketplace CTA experiment.
6. Integrate the home hero experiment.
7. Run browser verification and static checks.
