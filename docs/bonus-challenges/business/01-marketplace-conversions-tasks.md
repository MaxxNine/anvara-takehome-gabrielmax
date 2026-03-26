# Marketplace Conversions — Task Tracker

## Phase 1: Foundation

- [x] 1.1 Add `'marketplace-layout'` AB test to `lib/ab-testing/config.ts`
- [x] 1.2 Extend `PublisherSummary` type in `lib/types.ts` (add `subscriberCount`, `bio`, `avatar`, `isVerified`)
- [x] 1.3 Update backend `listAdSlots` publisher select (add `subscriberCount`, `isVerified`)
- [x] 1.4 Create `marketplace/components-b/format-helpers.ts`

## Phase 2: Grid B Variant

- [x] 2.1 Create `marketplace/components-b/ad-slot-card-b.tsx`
- [x] 2.2 Create `marketplace/components-b/marketplace-filter-bar.tsx`
- [x] 2.3 Create `marketplace/components-b/marketplace-grid-b.tsx`
- [x] 2.4 Update `marketplace/page.tsx` — route to grid B for variant B

## Phase 3: Detail B Variant

- [x] 3.1 Create `marketplace/[id]/components-b/publisher-profile-b.tsx`
- [x] 3.2 Create `marketplace/[id]/components-b/trust-signals-b.tsx`
- [x] 3.3 Create `marketplace/[id]/components-b/urgency-signals-b.tsx`
- [x] 3.4 Create `marketplace/[id]/components-b/booking-sidebar-b.tsx`
- [x] 3.5 Create `marketplace/[id]/components-b/related-listings-b.tsx`
- [x] 3.6 Create `marketplace/[id]/components-b/ad-slot-detail-b.tsx`
- [x] 3.7 Update `marketplace/[id]/page.tsx` — route to detail B for variant B

## Phase 4: Verification

- [x] 4.1 `typecheck` passes
- [x] 4.2 `lint` passes
- [ ] 4.3 Variant A renders unchanged (`?ab_force=marketplace-layout:A`)
- [ ] 4.4 Variant B grid renders with filters and redesigned cards
- [ ] 4.5 Variant B detail renders with publisher stats, trust/urgency, related listings
- [ ] 4.6 Booking flow works end-to-end in variant B

## Phase 5: Marketplace UX Polish

- [x] 5.1 Add proper interactive affordance to filter chips (`cursor-pointer`, hover, focus-visible)
- [x] 5.2 Add an icon-led toggle to show/hide advanced filters in the grid header
- [x] 5.3 Clarify filter labels so budget reads as monthly slot price, not CPM
- [x] 5.4 Rename `Types` to `Categories` in filter UI copy if that tests clearer with current inventory model
- [x] 5.5 Add advanced filter controls for `Estimated CPM`, `Availability`, and `Verified publisher`; keep `Reach` as a sort signal unless UX proves a filter is necessary
- [x] 5.6 Rework card hierarchy so format, metric cues, and verification do not compete visually
- [x] 5.7 Add iconography to card metadata and trust/demand cues
- [x] 5.8 Replace weak text-only metric badges with icon-led treatments for existing metrics like reach and estimated CPM
- [x] 5.9 Strengthen verified publisher affordance on cards and in marketplace scanning states without inventing new trust labels
- [ ] 5.10 Run responsive/visual QA on the updated grid after the filter and card polish pass
