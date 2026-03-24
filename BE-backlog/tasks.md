# Backend Tasks

## Challenge 03 — API Security

### Phase 1: Foundation

- [x] **1.1** Create `src/types/` — `auth.ts` (AuthUser, AuthRequest), `errors.ts` (NotFoundError, ValidationError, ForbiddenError), `index.ts` (barrel re-exports only)
- [x] **1.2** Rewrite `src/auth.ts` — Better Auth instance + `requireAuth` middleware
- [x] **1.3** Create `src/services/auth.service.ts` — `resolveUserRole()` extracted from routes
- [x] **1.4** Fix CORS in `src/index.ts` — add `origin` + `credentials: true`
- [x] **1.5** Fix `apps/frontend/lib/api.ts` — add `credentials: 'include'`
- [x] **1.6** Create `src/middleware/error-handler.ts` — centralized error handling

### Phase 1b: Rate Limiting (Redis)

- [x] **1.7** Add Redis service to `docker-compose.yml` (redis:7-alpine, port 6379)
- [x] **1.8** Add `REDIS_URL=redis://localhost:6379` to `.env`
- [x] **1.9** Install `express-rate-limit` + `rate-limit-redis` + `ioredis` in backend
- [x] **1.10** Create `src/middleware/rate-limiter.ts` — configure rate limit with Redis store
- [x] **1.11** Mount rate limiter in `src/index.ts` (global limit + stricter limit for auth routes)

### Phase 2: Secure Routes

- [x] **2.1** Apply `requireAuth` to campaign routes (GET list, GET :id, POST)
- [x] **2.2** Apply `requireAuth` to ad-slot routes (GET list, GET :id, POST, book, unbook)
- [x] **2.3** Wire up `GET /auth/me` with real auth (pure auth principal)
- [x] **2.4** Add protected `GET /auth/profile` for frontend bootstrap; keep `GET /auth/role/:userId` as deprecated compatibility wrapper

### Verification — Challenge 03

- [x] Unauthenticated requests return 401
- [x] Authenticated sponsor sees only their campaigns
- [x] Authenticated publisher sees only their ad-slots
- [x] Cross-role browsing works (sponsor can see ad-slots, publisher can see campaigns)
- [x] `/auth/me` returns user info when authenticated
- [x] Frontend login → dashboard flow still works end-to-end
- [x] Rate limiter returns 429 when limit exceeded
- [x] Redis container is running and rate limit state persists across server restarts

---

## Challenge 04 — CRUD Operations

### Phase 3: Services + New Endpoints

- [x] **3.1** Create `src/services/campaign.service.ts` — list, getById, create (done); update, delete (pending)
- [x] **3.2** Create `src/services/ad-slot.service.ts` — list, getById, create, book, unbook (done); update, delete (pending)
- [x] **3.3** Add `PUT /api/campaigns/:id` — ownership check + validation + 200
- [x] **3.4** Add `DELETE /api/campaigns/:id` — ownership check + 204
- [x] **3.5** Add `PUT /api/ad-slots/:id` — ownership check + validation + 200
- [x] **3.6** Add `DELETE /api/ad-slots/:id` — ownership check + 204
- [x] **3.7** Fix `POST /api/ad-slots` — basePrice > 0, use `req.user.publisherId`
- [x] **3.8** Refactor existing GET/POST handlers to use service layer (done during Challenge 03)

### Verification — Challenge 04

- [x] PUT campaigns updates and returns 200
- [x] DELETE campaigns returns 204
- [x] PUT ad-slots updates and returns 200
- [x] DELETE ad-slots returns 204
- [x] POST ad-slots validates basePrice > 0
- [x] POST ad-slots uses authenticated publisherId (not body)
- [x] Ownership violations return 403
- [x] Non-existent resources return 404
- [x] Invalid input returns 400
- [x] Changes visible in Prisma Studio (verified via direct PostgreSQL persistence in terminal environment)

---

## Challenge 05 — Server Actions

### Phase 0: Infrastructure

- [x] **5.0.1** Create `lib/action-types.ts` — `ActionState` interface + `initialActionState` constant
- [x] **5.0.2** Create `app/components/submit-button.tsx` — shared `'use client'` button using `useFormStatus()`
- [x] **5.0.3** Create `app/components/form-modal.tsx` — `'use client'` dialog wrapper (native `<dialog>`, no deps)

### Phase 1: Publisher Dashboard Migration

- [x] **5.1.1** Create `dashboard/publisher/data.ts` — server-side fetch with `serverApi` (mirror sponsor `data.ts`)
- [x] **5.1.2** Create `dashboard/publisher/loading.tsx` — skeleton UI (mirror sponsor `loading.tsx`)
- [x] **5.1.3** Rewrite `dashboard/publisher/components/ad-slot-list.tsx` — remove `'use client'`, useEffect, useState; accept `adSlots` as prop
- [x] **5.1.4** Update `dashboard/publisher/page.tsx` — call `data.ts`, pass props to `AdSlotList`
- [x] **5.1.5** Remove `'use client'` from `ad-slot-card.tsx`

### Phase 2: Sponsor Server Actions + Forms

- [x] **5.2.1** Create `dashboard/sponsor/actions/create-campaign.ts` — `'use server'`, POST `/api/campaigns`, `revalidatePath`
- [x] **5.2.2** Create `dashboard/sponsor/actions/update-campaign.ts` — PUT `/api/campaigns/:id`
- [x] **5.2.3** Create `dashboard/sponsor/actions/delete-campaign.ts` — DELETE `/api/campaigns/:id`
- [x] **5.2.4** Create `dashboard/sponsor/components/campaign-form.tsx` — `'use client'` form with `useActionState` (create + edit modes)
- [x] **5.2.5** Create `dashboard/sponsor/components/create-campaign-button.tsx` — button + modal
- [x] **5.2.6** Update `dashboard/sponsor/components/campaign-card.tsx` — add Edit/Delete buttons
- [x] **5.2.7** Update `dashboard/sponsor/page.tsx` — add `CreateCampaignButton` in header

### Phase 3: Publisher Server Actions + Forms

- [x] **5.3.1** Create `dashboard/publisher/actions/create-ad-slot.ts` — `'use server'`, POST `/api/ad-slots`, `revalidatePath`
- [x] **5.3.2** Create `dashboard/publisher/actions/update-ad-slot.ts` — PUT `/api/ad-slots/:id`
- [x] **5.3.3** Create `dashboard/publisher/actions/delete-ad-slot.ts` — DELETE `/api/ad-slots/:id`
- [x] **5.3.4** Create `dashboard/publisher/components/ad-slot-form.tsx` — `'use client'` form with `useActionState` (create + edit modes)
- [x] **5.3.5** Create `dashboard/publisher/components/create-ad-slot-button.tsx` — button + modal
- [x] **5.3.6** Update `dashboard/publisher/components/ad-slot-card.tsx` — add Edit/Delete buttons
- [x] **5.3.7** Update `dashboard/publisher/page.tsx` — add `CreateAdSlotButton` in header

### Verification — Challenge 05

- [x] Sponsor: create campaign → appears in list
- [x] Sponsor: edit campaign → updated data shown
- [x] Sponsor: delete campaign → removed from list
- [x] Publisher: create ad slot → appears in list
- [x] Publisher: edit ad slot → updated data shown
- [x] Publisher: delete ad slot → removed from list
- [x] Empty form submission shows validation errors
- [x] Submit buttons show "Saving..." / "Deleting..." during operations
- [x] `revalidatePath` refreshes data (no manual reload needed)
- [x] Backend 400/403 errors display user-friendly messages
- [x] `pnpm --filter @anvara/frontend typecheck` passes
- [x] `pnpm --filter @anvara/frontend lint` passes
- [x] No console errors
- [x] Prisma Studio reflects all CRUD operations

All paths relative to `apps/frontend/`.
