# Marketplace Conversions — Analysis & Implementation Plan

## Problem Analysis

The marketplace has a complete booking funnel (`Grid → Detail → Book`) but conversion rates are low. After auditing both pages, here are the identified barriers:

### Grid Page — Click-Through Barriers

| # | Issue | Impact | Evidence |
|---|-------|--------|----------|
| 1 | **No visual hierarchy** | Users can't distinguish high-value listings from low-value ones | All cards are identical dark boxes with text only |
| 2 | **No filtering or sorting** | Users can't find relevant listings — they must scan everything | There's a `TODO: Add search input and filter controls` comment in the code |
| 3 | **No social proof** | Nothing tells users which listings are popular or trusted | `publisher.monthlyViews` (up to 500K) exists in the API response but isn't displayed |
| 4 | **Booked items clutter the grid** | Available listings are diluted by unactionable cards | Booked cards are just dimmed to `opacity-60`, still occupying grid space |
| 5 | **No hover interaction** | Cards feel static and unresponsive | Only a basic `hover:shadow-md` — no color, scale, or border feedback |
| 6 | **Publisher credibility invisible** | No way to judge a listing's quality by its publisher | `isVerified`, `category`, `subscriberCount` are in the DB but not shown |

### Detail Page — Conversion Barriers

| # | Issue | Impact | Evidence |
|---|-------|--------|----------|
| 7 | **Extremely sparse content** | Not enough information to justify a booking decision | Just name, one-line description, status, price, and a form |
| 8 | **No publisher credibility** | Users can't assess if the publisher is worth the price | `monthlyViews`, `subscriberCount`, `bio`, `isVerified` all exist but aren't shown |
| 9 | **No value justification** | Price is displayed with zero context | $5,000/mo shown but no CPM calculation, audience size, or comparison |
| 10 | **No urgency signals** | Nothing motivates users to act now | Static "Available" text — no demand indicators or scarcity |
| 11 | **No trust signals** | No reassurance around the booking action | No "verified publisher", "cancel anytime", or "secure booking" messaging |
| 12 | **Dead-end page** | If a user doesn't book, they bounce | No related listings, no cross-sell — just "Back to Marketplace" |
| 13 | **Weak CTA area** | The booking form doesn't inspire confidence | Just a textarea and a flat purple button |

---

## Hypothesis

> **If we** surface publisher credibility data, add filtering/sorting, create visual hierarchy in cards, and build a trust-rich detail page with urgency signals and related listings, **then** we will increase both the grid click-through rate and the detail-page booking conversion rate, **because** users will find relevant listings faster, feel confident in the publisher's value, and encounter fewer dead ends.

---

## Solution: Marketplace Layout B Variant

We implement a `'marketplace-layout'` A/B test using the existing infrastructure. Variant A stays byte-for-byte identical. Variant B addresses the conversion barriers above.

### Architecture

- **AB test**: `'marketplace-layout'` added to `lib/ab-testing/config.ts` (50/50 split)
- **Routing**: Both `marketplace/page.tsx` and `marketplace/[id]/page.tsx` check the variant and render A or B components
- **Pattern**: Same as `home-a` / `home-b` and `nav-variant-a` / `nav-variant-b`
- **New files**: Placed in `components-b/` subdirectories alongside existing components

### Grid B Variant

1. **Filter bar** — Search input, type dropdown (DISPLAY/VIDEO/NEWSLETTER/PODCAST), sort dropdown (price, reach). Pure client-side filtering since all data is already loaded.
2. **Redesigned cards** — Type-specific left border accent, publisher reach badge (e.g., "500K views/mo"), verified checkmark, past bookings count, category pill, enhanced hover effects.
3. **Separation** — Available listings first, booked listings collapsed at the bottom.

### Detail B Variant

1. **Two-column layout** — Content left, sticky booking sidebar right (on desktop)
2. **Publisher profile** — Avatar (letter circle), name, verified badge, category, website
3. **Stats row** — Monthly views, subscribers, past bookings (3 stat cards)
4. **Urgency signals** — "Booked X times before", "High-traffic placement", "One sponsor per slot"
5. **Trust signals** — "Verified publisher", "Secure booking", "Cancel anytime"
6. **Booking sidebar** — Large price, cost-per-1K-views calculation, pulsing availability dot, the existing form (reused), trust signals
7. **Related listings** — Up to 3 available slots at the bottom, reducing dead-end bounce

### Data Changes

- `PublisherSummary` type extended with: `subscriberCount`, `bio`, `avatar`, `isVerified` (all optional)
- Backend `listAdSlots` query adds `subscriberCount` and `isVerified` to publisher select
- Detail endpoint already returns full publisher data (no change needed)

---

## File Plan

### New Files (10)

| File | Purpose |
|------|---------|
| `marketplace/components-b/format-helpers.ts` | `formatReach()`, `formatReachLabel()`, `getTypeAccentColor()` |
| `marketplace/components-b/ad-slot-card-b.tsx` | Redesigned card with social proof and visual hierarchy |
| `marketplace/components-b/marketplace-filter-bar.tsx` | Client-side filter/sort controls |
| `marketplace/components-b/marketplace-grid-b.tsx` | Grid wrapper with filter state management |
| `marketplace/[id]/components-b/ad-slot-detail-b.tsx` | Two-column detail page layout |
| `marketplace/[id]/components-b/publisher-profile-b.tsx` | Publisher header with avatar and verification |
| `marketplace/[id]/components-b/booking-sidebar-b.tsx` | Sticky booking sidebar with pricing and form |
| `marketplace/[id]/components-b/urgency-signals-b.tsx` | Demand and scarcity indicators |
| `marketplace/[id]/components-b/trust-signals-b.tsx` | Reassurance messaging below CTA |
| `marketplace/[id]/components-b/related-listings-b.tsx` | Related available listings section |

### Modified Files (5)

| File | Change |
|------|--------|
| `lib/ab-testing/config.ts` | Add `'marketplace-layout'` test definition |
| `lib/types.ts` | Extend `PublisherSummary` with optional fields |
| `backend/.../ad-slot.service.ts` | Add `subscriberCount`, `isVerified` to list publisher select |
| `marketplace/page.tsx` | Route to grid B for variant B users |
| `marketplace/[id]/page.tsx` | Route to detail B for variant B users |

---

## Measurement Strategy

### Primary Metrics (segmented by `marketplace_variant`)

| Funnel Stage | Metric | Events |
|-------------|--------|--------|
| Grid → Detail | Click-through rate | `ad_slot_click / marketplace_view` |
| Detail → Submit | Form intent rate | `placement_request_submit / ad_slot_view` |
| Submit → Success | Completion rate | `placement_request_success / placement_request_submit` |

### B-Only Metrics

- **Filter engagement**: How often users use search, type filters, and sort
- **Related listing clicks**: Whether cross-linking reduces bounce

### How to Compare

All existing analytics events already fire with consistent parameters. Adding `marketplace_variant` to event params allows segmenting in GA4:

1. Create custom dimension for `marketplace_variant`
2. Build comparison report: A vs B for each funnel stage
3. Key decision metric: **end-to-end booking rate** (bookings / grid views)

### Statistical Approach

With a 50/50 split, run the test for at least 2 weeks. If B shows a statistically significant improvement in booking conversion rate, promote B to 100%.

---

## Verification Plan

1. `?ab_force=marketplace-layout:A` → existing marketplace unchanged
2. `?ab_force=marketplace-layout:B` → new grid + detail renders
3. `typecheck` + `lint` pass
4. Filter bar filters and sorts correctly
5. Detail B shows publisher stats, trust/urgency signals, related listings
6. Booking flow works end-to-end in B variant
7. Analytics events include `marketplace_variant` field
