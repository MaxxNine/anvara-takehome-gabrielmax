# Challenge 03 - A/B Testing Tasks

## Phase 1 - Core Infrastructure

- [x] Create `apps/frontend/lib/ab-testing/config.ts` with typed test definitions and active flags.
- [x] Create `apps/frontend/lib/ab-testing/assignment.ts` with deterministic weighted assignment and visitor ID generation.
- [x] Create `apps/frontend/lib/ab-testing/cookies.ts` with the shared cookie schema, parse, and serialize helpers.
- [x] Create `apps/frontend/lib/ab-testing/index.ts` barrel exports.
- [x] Add `apps/frontend/middleware.ts` to create and backfill A/B assignments before render.
- [x] Exclude static assets, images, and API routes from the middleware matcher.

## Phase 2 - Variant Access APIs

- [x] Create `apps/frontend/lib/ab-testing/server.ts` for server-side variant reads from `next/headers`.
- [x] Create `apps/frontend/lib/ab-testing/debug.ts` for `ab_force` parsing and debug logging helpers.
- [x] Create `apps/frontend/lib/ab-testing/hooks.ts` with `useABTest(testName, initialVariant?)`.
- [x] Keep `app/page.tsx` server-first by using server-side variant reads instead of converting the page to a client component.
- [x] Ensure forced variants do not overwrite the persisted experiment cookie.

## Phase 3 - Analytics Integration

- [x] Add `variant_assigned` to `apps/frontend/lib/analytics/events.ts`.
- [x] Track `variant_assigned` only for real new assignments or explicit forced-debug usage.
- [x] Update `apps/frontend/app/components/analytics-provider.tsx` to set GA4 `user_properties` from active A/B assignments.
- [x] Include experiment metadata in relevant conversion events, starting with the marketplace CTA flow.

## Phase 4 - UI Rollout

- [x] Integrate `cta-button-text` into `apps/frontend/app/marketplace/[id]/components/placement-request-form.tsx`.
- [x] Integrate `home-hero-layout` into the home page through a thin server-first component split.
- [ ] Keep existing conversion and GA flows working while the experiment layer is added.

## Phase 5 - Verification

- [ ] Verify the `anvara_ab_tests` cookie is created with `visitorId` and assignments.
- [ ] Verify variants persist across refreshes for the same visitor.
- [ ] Verify a new incognito visitor can receive a different variant.
- [ ] Verify `?ab_force=cta-button-text:B` overrides rendering for QA.
- [ ] Verify `variant_assigned` is captured in the analytics debug flow.
- [ ] Verify GA4 user properties include the active A/B assignments.
- [ ] Verify existing `page_view`, placement, and form tracking still work after the A/B layer is added.
- [ ] Run `pnpm --filter @anvara/frontend typecheck`.
- [ ] Run `pnpm --filter @anvara/frontend lint`.
