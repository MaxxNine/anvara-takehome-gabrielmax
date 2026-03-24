# Bonus Challenge 02 — Client-Side Conversion Tracking

## Context

Challenge 01 (GA4 Setup) provides the base analytics infrastructure: `<GoogleAnalytics>` in the layout and `trackEvent()` in `lib/analytics.ts`. This challenge enhances it with a typed conversion event system, SPA page view tracking, and structured event data — enabling real funnel analysis in GA4.

**Depends on**: Challenge 01 (GA4 Setup)

---

## Architecture Decisions

### 1. Promote `lib/analytics.ts` → `lib/analytics/` directory

Challenge 02 adds typed events, hooks, and parameter builders — too much for a single file. Splitting into `core.ts`, `events.ts`, `hooks.ts` with a barrel `index.ts` keeps each file focused. Import path stays the same: `import { trackEvent } from '@/lib/analytics'`.

### 2. `useTrackPageView` hook for SPA route changes

GA4's `<GoogleAnalytics>` fires `page_view` on initial load only. Client-side navigation via `<Link>` doesn't trigger new page loads. `usePathname()` from `next/navigation` detects route changes; a `useEffect` fires `page_view` when the path changes.

### 3. `<AnalyticsProvider>` wrapper in root layout

Running `useTrackPageView()` in every page would be repetitive and easy to forget. A single `<AnalyticsProvider>` client component in the layout handles all route changes. It renders `<>{children}</>` — zero extra DOM nodes.

### 4. Typed event parameter builders

Instead of ad-hoc `{ ad_slot_id: slot.id, price: ... }` at every call site, helper functions like `adSlotEventParams(slot)` return consistent field sets. Prevents data inconsistency across events about the same entity.

### 5. Micro vs macro conversion classification

Type-level separation (`MicroConversion | MacroConversion`) provides autocomplete and documents intent. GA4 can be configured to mark macro-conversion events as "key events" for funnel analysis — no code changes needed.

### 6. Non-blocking fire-and-forget

All analytics calls return `void`, not `Promise`. `gtag()` queues internally and batches network requests. If analytics fails, the user's workflow is unaffected.

---

## Implementation

### New Files

#### `apps/frontend/lib/analytics/core.ts` (~50 lines)

Moved from `lib/analytics.ts` (Challenge 01). Contains:
- `window.gtag` type augmentation
- `type AnalyticsEventParams`
- `trackEvent(eventName, params)` — guarded, fire-and-forget
- `isAnalyticsEnabled()` helper

#### `apps/frontend/lib/analytics/events.ts` (~80 lines)

Typed event definitions and parameter builders:
- Conversion type unions:
  ```ts
  type MicroConversion = 'marketplace_view' | 'ad_slot_click' | 'ad_slot_view' | 'cta_click' | 'nav_click';
  type MacroConversion = 'placement_request_submit' | 'placement_request_success' | 'login_success' | 'signup_complete';
  type EngagementEvent = 'form_submit' | 'form_error' | 'logout';
  type AnalyticsEvent = MicroConversion | MacroConversion | EngagementEvent | 'page_view';
  ```
- Parameter builders:
  ```ts
  function adSlotEventParams(slot: AdSlot): AnalyticsEventParams
  // → { ad_slot_id, ad_slot_type, ad_slot_name, price, publisher_name }

  function campaignEventParams(campaign: Campaign): AnalyticsEventParams
  // → { campaign_id, campaign_name, budget, status }
  ```

#### `apps/frontend/lib/analytics/hooks.ts` (~40 lines)

React hooks for analytics:
- `useTrackPageView()` — uses `usePathname()`, fires `page_view` on path change via `useEffect`
- `useTrackOnMount(eventName, params)` — fires event once on component mount (for "view" events)

#### `apps/frontend/lib/analytics/index.ts` (~10 lines)

Barrel re-exports from `core`, `events`, `hooks`.

#### `apps/frontend/app/components/analytics-provider.tsx` (~20 lines)

```tsx
'use client';
import { useTrackPageView } from '@/lib/analytics/hooks';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useTrackPageView();
  return <>{children}</>;
}
```

### Modified Files

#### `apps/frontend/lib/analytics.ts`

**Deleted** — replaced by `lib/analytics/` directory.

#### `apps/frontend/app/layout.tsx`

- Import `AnalyticsProvider` from `@/app/components/analytics-provider`
- Wrap content: `<AnalyticsProvider><main ...>{children}</main></AnalyticsProvider>`

#### `apps/frontend/app/marketplace/components/ad-slot-grid.tsx`

- Import `adSlotEventParams` from `@/lib/analytics`
- Enrich `ad_slot_click` with full params: `trackEvent('ad_slot_click', adSlotEventParams(slot))`
- Add `marketplace_view` event on mount after data loads

#### `apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx`

- Import param builders
- Enrich existing events:
  ```ts
  trackEvent('ad_slot_view', { ...adSlotEventParams(adSlot), conversion_type: 'micro' });
  trackEvent('placement_request_submit', { ...adSlotEventParams(adSlot), conversion_type: 'macro' });
  trackEvent('placement_request_success', { ...adSlotEventParams(adSlot), conversion_type: 'macro' });
  ```

#### `apps/frontend/app/dashboard/sponsor/components/campaign-form.tsx`

- Import `trackEvent`
- In `useEffect` on `state.success`: `trackEvent('form_submit', { form: isEdit ? 'update_campaign' : 'create_campaign' })`
- When `state.error` or `state.fieldErrors`: `trackEvent('form_error', { form: ..., error_type: 'validation' | 'server' })`

#### `apps/frontend/app/dashboard/publisher/components/ad-slot-form.tsx`

Same pattern as campaign form — track `form_submit` / `form_error`.

---

## Conversion Funnel

The marketplace user journey, tracked as sequential events:

```
Step 1: Home page view          → page_view (path: /)
Step 2: Marketplace browse      → marketplace_view (micro-conversion)
Step 3: Ad slot detail view     → ad_slot_view (micro-conversion)
Step 4: Placement request       → placement_request_submit (macro-conversion)
Step 5: Placement confirmed     → placement_request_success (macro-conversion)
```

GA4 reconstructs funnels by sequencing these events. The code fires the right events with the right data — GA4 handles the analysis.

---

## Verification

1. Navigate between pages using `<Link>` (not full reloads) → verify `page_view` fires in Network tab for each route change
2. Open `/marketplace` → verify `marketplace_view` fires
3. Click an ad slot → verify `ad_slot_click` fires with full `adSlotEventParams`
4. View detail page → verify `ad_slot_view` fires with `conversion_type: 'micro'`
5. Book a placement → verify `placement_request_submit` then `placement_request_success` fire with `conversion_type: 'macro'`
6. Create a campaign → verify `form_submit` fires with `form: 'create_campaign'`
7. Submit invalid form → verify `form_error` fires
8. All events are non-blocking (no visible delay in UI)
9. `pnpm --filter @anvara/frontend typecheck` passes
10. `pnpm --filter @anvara/frontend lint` passes
