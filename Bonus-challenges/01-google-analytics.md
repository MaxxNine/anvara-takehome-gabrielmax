# Bonus Challenge 01 — Google Analytics Setup

## Context

No analytics infrastructure exists in the frontend. This challenge adds GA4 integration with custom event tracking beyond page views, using the official `@next/third-parties` package.

**Stack**: Next.js 16.1.3, React 19.2.3, Tailwind v4

---

## Architecture Decisions

### 1. Use `@next/third-parties/google` for GA4

The official Next.js package provides a `<GoogleAnalytics>` component that handles script loading via `next/script` with `afterInteractive` strategy. No manual `<script>` tag management. Tree-shakeable, lightweight.

### 2. `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable

Follows the existing `NEXT_PUBLIC_` pattern (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`). If the variable is absent, GA simply doesn't load — no errors, no broken pages. This keeps local dev clean.

### 3. `lib/analytics.ts` utility (not a hook)

`trackEvent(name, params)` is imperative — called from click handlers, form callbacks, etc. A hook (`useTrackEvent`) would add unnecessary indirection for what is fundamentally a fire-and-forget side effect. A plain function can be called from any context.

### 4. Guard all `gtag()` calls

Check `typeof window !== 'undefined'` and verify `window.gtag` exists before calling. Safe in SSR, test environments, and local dev without a GA measurement ID.

### 5. No consent management layer

Out of scope for a take-home. The plan notes where a consent banner would integrate (conditional rendering of `<GoogleAnalytics>` based on consent state) but does not implement it.

---

## Implementation

### Package Installation

```bash
pnpm --filter @anvara/frontend add @next/third-parties
```

### New Files

#### `apps/frontend/lib/analytics.ts` (~55 lines)

Core analytics utility module.

**Contents:**
- Global type augmentation for `window.gtag`
- `type AnalyticsEventParams = Record<string, string | number | boolean | undefined>`
- `GA_EVENTS` constant object mapping semantic names to GA event strings (autocomplete, prevents typos):
  ```ts
  export const GA_EVENTS = {
    CTA_CLICK: 'cta_click',
    NAV_CLICK: 'nav_click',
    LOGIN_SUCCESS: 'login_success',
    LOGOUT: 'logout',
    AD_SLOT_CLICK: 'ad_slot_click',
    AD_SLOT_VIEW: 'ad_slot_view',
    PLACEMENT_REQUEST: 'placement_request',
    PLACEMENT_SUCCESS: 'placement_success',
  } as const;
  ```
- `trackEvent(eventName: string, params?: AnalyticsEventParams): void`
  - Guards: `typeof window === 'undefined'` or `!window.gtag` → return
  - Calls `window.gtag('event', eventName, params)`
  - Non-blocking, fire-and-forget

### Modified Files

#### `apps/frontend/app/layout.tsx`

- Import `GoogleAnalytics` from `@next/third-parties/google`
- Add conditionally inside `<body>`:
  ```tsx
  {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
  )}
  ```
- Position: after `<main>` (position doesn't matter for scripts, keeps semantic HTML clean)

#### `apps/frontend/app/page.tsx` (home page)

- Import `trackEvent`, `GA_EVENTS` from `@/lib/analytics`
- The "Get Started" CTA link needs an `onClick` handler → wrap in a thin `'use client'` component or convert page
- Track: `trackEvent(GA_EVENTS.CTA_CLICK, { location: 'home_hero', label: 'get_started' })`

#### `apps/frontend/app/components/nav.tsx` (already `'use client'`)

- Import `trackEvent`, `GA_EVENTS`
- Add `onClick` to nav links: `trackEvent(GA_EVENTS.NAV_CLICK, { destination: '/marketplace' })`
- Track logout in existing handler: `trackEvent(GA_EVENTS.LOGOUT)`

#### `apps/frontend/app/login/page.tsx` (already `'use client'`)

- Import `trackEvent`, `GA_EVENTS`
- In `onSuccess` callback: `trackEvent(GA_EVENTS.LOGIN_SUCCESS, { method: 'email' })`

#### `apps/frontend/app/marketplace/components/ad-slot-grid.tsx` (already `'use client'`)

- Import `trackEvent`, `GA_EVENTS`
- Add `onClick` to each `<Link>` card:
  ```tsx
  onClick={() => trackEvent(GA_EVENTS.AD_SLOT_CLICK, {
    ad_slot_id: slot.id,
    ad_slot_type: slot.type,
    ad_slot_name: slot.name,
  })}
  ```

#### `apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx` (already `'use client'`)

- Import `trackEvent`, `GA_EVENTS`
- Track view on mount — in the existing `useEffect` after `getAdSlot` resolves:
  ```ts
  trackEvent(GA_EVENTS.AD_SLOT_VIEW, {
    ad_slot_id: id,
    ad_slot_type: adSlot.type,
    price: Number(adSlot.basePrice),
  });
  ```
- Track booking request at the start of `handleBooking`:
  ```ts
  trackEvent(GA_EVENTS.PLACEMENT_REQUEST, { ad_slot_id: adSlot.id });
  ```
- Track booking success after successful API call:
  ```ts
  trackEvent(GA_EVENTS.PLACEMENT_SUCCESS, { ad_slot_id: adSlot.id });
  ```

#### `.env.example`

- Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- Comment: `# Optional: Google Analytics 4 measurement ID. Omit for local dev.`

---

## Event Taxonomy

| Event | Trigger Location | Parameters |
|-------|-----------------|------------|
| `cta_click` | Home page CTA, marketplace CTAs | `location`, `label` |
| `nav_click` | Nav component links | `destination` |
| `login_success` | Login page success callback | `method` |
| `logout` | Nav logout button | — |
| `ad_slot_click` | Marketplace grid card click | `ad_slot_id`, `ad_slot_type`, `ad_slot_name` |
| `ad_slot_view` | Detail page mount | `ad_slot_id`, `ad_slot_type`, `price` |
| `placement_request` | Detail page booking start | `ad_slot_id` |
| `placement_success` | Detail page booking success | `ad_slot_id` |

---

## Verification

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-DEBUGVIEW1` in `.env`
2. Run `pnpm dev`, open Chrome DevTools → Network tab → filter by `google` or `gtag`
3. Verify GA script loads on initial page load
4. Click "Get Started" on home page → verify `cta_click` event fires
5. Navigate to `/marketplace` → click an ad slot card → verify `ad_slot_click` fires
6. View detail page → verify `ad_slot_view` fires on load
7. Click "Book This Placement" → verify `placement_request` then `placement_success` fire
8. Click nav links → verify `nav_click` fires
9. Logout → verify `logout` event fires
10. `pnpm --filter @anvara/frontend typecheck` passes
11. `pnpm --filter @anvara/frontend lint` passes
