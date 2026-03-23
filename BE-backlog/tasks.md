# Backend Tasks

## Challenge 03 — API Security

### Phase 1: Foundation

- [ ] **1.1** Create `src/types/` — `auth.ts` (AuthUser, AuthRequest), `errors.ts` (NotFoundError, ValidationError, ForbiddenError), `index.ts` (barrel re-exports only)
- [ ] **1.2** Rewrite `src/auth.ts` — Better Auth instance + `requireAuth` middleware
- [ ] **1.3** Create `src/services/auth.service.ts` — `resolveUserRole()` extracted from routes
- [ ] **1.4** Fix CORS in `src/index.ts` — add `origin` + `credentials: true`
- [ ] **1.5** Fix `apps/frontend/lib/api.ts` — add `credentials: 'include'`
- [ ] **1.6** Create `src/middleware/error-handler.ts` — centralized error handling

### Phase 1b: Rate Limiting (Redis)

- [ ] **1.7** Add Redis service to `docker-compose.yml` (redis:7-alpine, port 6379)
- [ ] **1.8** Add `REDIS_URL=redis://localhost:6379` to `.env`
- [ ] **1.9** Install `express-rate-limit` + `rate-limit-redis` + `ioredis` in backend
- [ ] **1.10** Create `src/middleware/rate-limiter.ts` — configure rate limit with Redis store
- [ ] **1.11** Mount rate limiter in `src/index.ts` (global limit + stricter limit for auth routes)

### Phase 2: Secure Routes

- [ ] **2.1** Apply `requireAuth` to campaign routes (GET list, GET :id, POST)
- [ ] **2.2** Apply `requireAuth` to ad-slot routes (GET list, GET :id, POST, book, unbook)
- [ ] **2.3** Wire up `GET /auth/me` with real auth
- [ ] **2.4** Protect `GET /auth/role/:userId` + refactor to use auth service

### Verification — Challenge 03

- [ ] Unauthenticated requests return 401
- [ ] Authenticated sponsor sees only their campaigns
- [ ] Authenticated publisher sees only their ad-slots
- [ ] Cross-role browsing works (sponsor can see ad-slots, publisher can see campaigns)
- [ ] `/auth/me` returns user info when authenticated
- [ ] Frontend login → dashboard flow still works end-to-end
- [ ] Rate limiter returns 429 when limit exceeded
- [ ] Redis container is running and rate limit state persists across server restarts

---

## Challenge 04 — CRUD Operations

### Phase 3: Services + New Endpoints

- [ ] **3.1** Create `src/services/campaign.service.ts` — list, getById, create, update, delete
- [ ] **3.2** Create `src/services/ad-slot.service.ts` — list, getById, create, update, delete, book, unbook
- [ ] **3.3** Add `PUT /api/campaigns/:id` — ownership check + validation + 200
- [ ] **3.4** Add `DELETE /api/campaigns/:id` — ownership check + 204
- [ ] **3.5** Add `PUT /api/ad-slots/:id` — ownership check + validation + 200
- [ ] **3.6** Add `DELETE /api/ad-slots/:id` — ownership check + 204
- [ ] **3.7** Fix `POST /api/ad-slots` — basePrice > 0, use `req.user.publisherId`
- [ ] **3.8** Refactor existing GET/POST handlers to use service layer

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
