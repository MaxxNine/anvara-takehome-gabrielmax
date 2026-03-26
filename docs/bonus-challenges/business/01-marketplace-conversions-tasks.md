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
