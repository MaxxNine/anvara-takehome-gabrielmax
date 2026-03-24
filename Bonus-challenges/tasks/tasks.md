# Frontend Refactor Tasks

- [x] Refactor `apps/frontend/app/components/nav.tsx` to a server-first architecture.
- [x] Move nav session and role resolution to the server using `auth.api.getSession(...)` and shared auth helpers.
- [x] Extract tiny client leaves for tracked navigation and logout behavior.
- [x] Move marketplace list reads out of client `useEffect` and into `apps/frontend/app/marketplace/data.ts`.
- [x] Update `apps/frontend/app/marketplace/page.tsx` to fetch marketplace data on the server and pass props down.
- [x] Split marketplace list UI into smaller components if needed (`ad-slot-grid`, `ad-slot-card`, tracked link leaf).
- [x] Move marketplace detail reads out of client `useEffect` and into `apps/frontend/app/marketplace/[id]/data.ts`.
- [x] Update `apps/frontend/app/marketplace/[id]/page.tsx` to fetch slot, session, and role data on the server.
- [x] Split `apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx` into smaller UI and interaction components.
- [x] Convert booking to a server action in `apps/frontend/app/marketplace/[id]/actions/`.
- [x] Convert unbooking/reset to a server action in `apps/frontend/app/marketplace/[id]/actions/`.
- [x] Keep analytics in small client boundaries only; avoid pushing GA runtime logic into server actions.
- [x] Tighten analytics typing with an event-to-params map.
- [x] Centralize navigation-sensitive analytics behavior in shared helpers only.
- [x] Remove duplicated auth/bootstrap logic from client components.
- [x] Re-run browser verification for `cta_click`, `nav_click`, `logout`, `login_success`, `ad_slot_click`, `ad_slot_view`, `placement_request`, and `placement_success` after the refactor.
- [x] Re-run `pnpm --filter @anvara/frontend typecheck`.
- [x] Re-run `pnpm --filter @anvara/frontend lint`.

## Rate Limiting Hardening

- [x] Audit all Next server actions and route handlers, and classify which ones require dedicated rate limiting versus relying on the backend API limiter.
- [x] Preserve the real client identity across `server action -> backend API` calls by forwarding trusted IP headers from `apps/frontend/lib/server-api.ts`.
- [x] Update the backend rate limiter to use a trusted client key strategy (`userId` when authenticated, forwarded client IP otherwise) instead of only the immediate caller IP.
- [x] Confirm backend proxy settings and trust boundaries before honoring forwarded IP headers.
- [x] Add a shared server-only rate limit helper for sensitive Next server actions, with Redis-backed storage and a graceful fallback policy.
- [x] Apply action-level rate limiting only to sensitive or expensive server actions first (`bookPlacementAction`, `resetListingAction`, and future auth/recovery/email/payment actions as they are introduced).
- [x] Normalize `429` handling so server actions and UI surfaces present rate-limit failures consistently.
- [x] Add targeted tests or verification scripts for backend limiter behavior and server-action limiter behavior.
- [ ] Document the rate-limit policy, keys, limits, and fallback behavior for both backend APIs and Next server actions.
