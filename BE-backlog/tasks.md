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

- [ ] PUT campaigns updates and returns 200
- [ ] DELETE campaigns returns 204
- [ ] PUT ad-slots updates and returns 200
- [ ] DELETE ad-slots returns 204
- [ ] POST ad-slots validates basePrice > 0
- [ ] POST ad-slots uses authenticated publisherId (not body)
- [ ] Ownership violations return 403
- [ ] Non-existent resources return 404
- [ ] Invalid input returns 400
- [ ] Changes visible in Prisma Studio

---

## Challenge 05 — Server Actions (Future)

- [ ] **5.1** Create `apps/frontend/app/dashboard/sponsor/actions.ts` — campaign mutations
- [ ] **5.2** Create `apps/frontend/app/dashboard/publisher/actions.ts` — ad-slot mutations
- [ ] **5.3** Update `server-api.ts` to handle 204 (no body) responses
- [ ] **5.4** Add update/delete input types (co-locate with their consumers or split by domain, not into a single types file)
- [ ] **5.5** Build sponsor dashboard forms (create, edit, delete campaigns)
- [ ] **5.6** Build publisher dashboard forms (create, edit, delete ad-slots)
- [ ] **5.7** Add `useActionState` + `useFormStatus` for loading/error states
