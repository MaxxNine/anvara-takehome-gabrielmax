# Bonus Challenges — Analytics

Implementation plans for the 3 analytics bonus challenges.

## Challenges

| # | Challenge | Difficulty | Status | Plan |
|---|-----------|------------|--------|------|
| 01 | [Google Analytics Setup](./01-google-analytics.md) | Medium | Planned | GA4 via `@next/third-parties`, `trackEvent()` utility, custom event tracking |
| 02 | [Conversion Tracking](./02-conversion-tracking.md) | Medium-Hard | Planned | Typed event system, `useTrackPageView` hook, `<AnalyticsProvider>`, funnel tracking |
| 03 | [A/B Testing](./03-ab-testing.md) | Hard | Planned | Cookie-based, `useABTest` hook, middleware assignment, weighted splits, debug mode |

## Dependency Graph

```
Challenge 01 (GA4 Setup)
  │ provides: window.gtag, trackEvent(), <GoogleAnalytics>
  ▼
Challenge 02 (Conversion Tracking)
  │ provides: typed events, useTrackPageView, <AnalyticsProvider>, param builders
  │ refactors: lib/analytics.ts → lib/analytics/ directory
  ▼
Challenge 03 (A/B Testing)
  │ provides: useABTest hook, middleware.ts, cookie persistence, debug mode
  │ integrates: variant_assigned events, GA4 user properties
```

Implementation order: **01 → 02 → 03** (each builds on the previous).

## Key Decisions

- **No external services** — GA4 needs only a measurement ID env var; A/B testing is fully self-contained with cookies
- **No backend changes** — all analytics are frontend-only
- **Non-blocking** — all tracking is fire-and-forget, never impacts user interactions
- **Progressive enhancement** — if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is absent, everything degrades gracefully (no errors)
