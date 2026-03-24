# Frontend Refactor Tasks

- [x] Refactor `apps/frontend/app/components/nav.tsx` to a server-first architecture.
- [x] Move nav session and role resolution to the server using `auth.api.getSession(...)` and shared auth helpers.
- [ ] Extract tiny client leaves for tracked navigation and logout behavior.
- [ ] Move marketplace list reads out of client `useEffect` and into `apps/frontend/app/marketplace/data.ts`.
- [ ] Update `apps/frontend/app/marketplace/page.tsx` to fetch marketplace data on the server and pass props down.
- [ ] Split marketplace list UI into smaller components if needed (`ad-slot-grid`, `ad-slot-card`, tracked link leaf).
- [ ] Move marketplace detail reads out of client `useEffect` and into `apps/frontend/app/marketplace/[id]/data.ts`.
- [ ] Update `apps/frontend/app/marketplace/[id]/page.tsx` to fetch slot, session, and role data on the server.
- [ ] Split `apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx` into smaller UI and interaction components.
- [ ] Convert booking to a server action in `apps/frontend/app/marketplace/[id]/actions/`.
- [ ] Convert unbooking/reset to a server action in `apps/frontend/app/marketplace/[id]/actions/`.
- [ ] Keep analytics in small client boundaries only; avoid pushing GA runtime logic into server actions.
- [ ] Tighten analytics typing with an event-to-params map.
- [ ] Centralize navigation-sensitive analytics behavior in shared helpers only.
- [ ] Remove duplicated auth/bootstrap logic from client components.
- [ ] Re-run browser verification for `cta_click`, `nav_click`, `logout`, `login_success`, `ad_slot_click`, `ad_slot_view`, `placement_request`, and `placement_success` after the refactor.
- [ ] Re-run `pnpm --filter @anvara/frontend typecheck`.
- [ ] Re-run `pnpm --filter @anvara/frontend lint`.
