# Backend Architecture Refactor — Implementation Plan

## Context

The backend (`apps/backend/`) has all business logic inlined in route handlers, no working auth middleware, and missing CRUD endpoints. This plan refactors into a clean **middleware / service / route** architecture that supports:

- **Challenge 03**: Auth middleware + user-scoped data access
- **Challenge 04**: Complete CRUD operations (PUT/DELETE for campaigns & ad-slots)
- **Challenge 05** (later): Frontend server actions calling these secured endpoints

**Key insight**: Better Auth is already a backend dependency (`package.json:26`), and the frontend's `server-api.ts` already forwards cookies. We just need the backend to validate those cookies.

---

## Target Architecture

```
apps/backend/src/
├── index.ts                      # Express app (modify: CORS fix)
├── auth.ts                       # Better Auth instance + requireAuth middleware (rewrite)
├── db.ts                         # Prisma client (keep as-is)
├── middleware/
│   ├── error-handler.ts          # Centralized error handling (new)
│   └── rate-limiter.ts           # Redis-backed rate limiting (new)
├── services/
│   ├── auth.service.ts           # Role resolution (new, extract from routes/auth.ts)
│   ├── campaign.service.ts       # Campaign CRUD logic (new)
│   └── ad-slot.service.ts        # Ad slot CRUD logic (new)
├── types/
│   └── index.ts                  # AuthRequest, AuthUser, custom errors (new)
├── routes/
│   ├── index.ts                  # Router aggregator (keep)
│   ├── auth.ts                   # Auth routes (modify: wire up /me)
│   ├── campaigns.ts              # Campaign routes (refactor: auth + services + PUT/DELETE)
│   ├── adSlots.ts                # Ad slot routes (refactor: auth + services + PUT/DELETE + fix POST)
│   ├── sponsors.ts               # (minor: add auth)
│   ├── publishers.ts             # (minor: add auth)
│   ├── placements.ts             # (keep for now)
│   ├── dashboard.ts              # (keep)
│   └── health.ts                 # (keep)
└── utils/helpers.ts              # (keep)
```

**Design principle**: Routes are thin (parse HTTP, call service, return response). Services own business logic + Prisma calls. Auth middleware resolves the full user context once per request.

---

## Access Model

Cross-role reads are allowed:
- **Sponsors** see their own campaigns + can browse all available ad-slots (needed for booking)
- **Publishers** see their own ad-slots + can browse active campaigns (marketplace visibility)
- **Mutations** are strictly scoped to owned resources

---

## Phase 1: Foundation (Types + Auth Infrastructure)

### 1.1 Create `types/index.ts`

Define `AuthUser`, `AuthRequest`, and custom error classes (`NotFoundError`, `ValidationError`, `ForbiddenError`).

**File**: `apps/backend/src/types/index.ts` (new)

### 1.2 Rewrite `auth.ts` — Better Auth instance + `requireAuth`

Create a Better Auth server instance (mirror frontend's `apps/frontend/auth.ts` config — same DB, same secret, same `disableCSRFCheck`). Then implement `requireAuth`:

1. Convert Express `req.headers` to web-standard `Headers` (Better Auth expects this)
2. Call `auth.api.getSession({ headers })`
3. If no session → 401
4. Resolve role: query `prisma.sponsor` then `prisma.publisher` by `session.user.id`
5. Attach full `AuthUser` to `req.user`
6. Call `next()`

Keep `roleMiddleware` as-is (it already works, just needs `requireAuth` to run first).

**File**: `apps/backend/src/auth.ts` (rewrite)

### 1.3 Create `services/auth.service.ts`

Extract role resolution logic from `routes/auth.ts:26-58` into a reusable `resolveUserRole(userId)` function. Used by both `requireAuth` middleware and the `/auth/role/:userId` endpoint.

**File**: `apps/backend/src/services/auth.service.ts` (new)

### 1.4 Fix CORS in `index.ts`

```ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3847',
  credentials: true,
}));
```

Without `credentials: true`, the browser won't send cookies cross-origin.

**File**: `apps/backend/src/index.ts` (modify line 11)

### 1.5 Fix frontend `api.ts` — add `credentials: 'include'`

The client-side API helper doesn't send cookies. Add `credentials: 'include'` to the fetch call.

**File**: `apps/frontend/lib/api.ts` (modify line 22)

### 1.6 Create `middleware/error-handler.ts`

Centralized Express error handler that catches custom errors by type and returns appropriate status codes. Mount at the end of the middleware chain in `index.ts`.

**File**: `apps/backend/src/middleware/error-handler.ts` (new)

### 1.7–1.11 Rate Limiting with Redis

Add Redis as infrastructure and implement API rate limiting.

**Infrastructure:**
- Add Redis service to `docker-compose.yml` (`redis:7-alpine`, port 6379)
- Add `REDIS_URL=redis://localhost:6379` to `.env`
- Install `express-rate-limit`, `rate-limit-redis`, and `ioredis` in the backend

**Implementation:**
Create `src/middleware/rate-limiter.ts` with two limiters:

- **Global limiter**: 100 requests per 15-minute window per IP — applied to all `/api` routes
- **Auth limiter**: 10 requests per 15-minute window per IP — applied to `/api/auth/login` and similar sensitive endpoints to prevent brute-force

Both use a Redis store (`rate-limit-redis` with `ioredis` client) so state persists across server restarts and would be shared across instances in production.

Mount in `src/index.ts` before route handlers:
```ts
app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);
```

**Files**:
- `docker-compose.yml` (add redis service)
- `.env` (add REDIS_URL)
- `apps/backend/package.json` (new deps)
- `apps/backend/src/middleware/rate-limiter.ts` (new)
- `apps/backend/src/index.ts` (mount limiters)

---

## Phase 2: Secure Existing Routes (Challenge 03)

### 2.1 Apply `requireAuth` to campaign routes

- `GET /` — If SPONSOR, auto-filter by `req.user.sponsorId`. If PUBLISHER, return all.
- `GET /:id` — Sponsors can only view their own (403 if not owned). Publishers can view any.
- `POST /` — `requireAuth` + `roleMiddleware(['SPONSOR'])`. Use `req.user.sponsorId`, ignore body.

**File**: `apps/backend/src/routes/campaigns.ts`

### 2.2 Apply `requireAuth` to ad-slot routes

- `GET /` — If PUBLISHER, auto-filter by `req.user.publisherId`. If SPONSOR, return all available.
- `GET /:id` — Publishers can only view their own (403 if not owned). Sponsors can view any.
- `POST /` — `requireAuth` + `roleMiddleware(['PUBLISHER'])`. Use `req.user.publisherId`.
- `POST /:id/book` — `requireAuth` + `roleMiddleware(['SPONSOR'])`. Use `req.user.sponsorId`.
- `POST /:id/unbook` — `requireAuth`.

**File**: `apps/backend/src/routes/adSlots.ts`

### 2.3 Wire up `GET /auth/me`

Replace hardcoded 401 with `requireAuth` middleware + return `req.user`.

**File**: `apps/backend/src/routes/auth.ts`

### 2.4 Protect and refactor `GET /auth/role/:userId`

Add `requireAuth`. Replace inline Prisma queries with `resolveUserRole()` from auth service.

**File**: `apps/backend/src/routes/auth.ts`

---

## Phase 3: Service Layer + CRUD (Challenge 04)

### 3.1 Create `services/campaign.service.ts`

| Function | Source |
|---|---|
| `listCampaigns(filters)` | Extract from GET / handler |
| `getCampaignById(id)` | Extract from GET /:id handler |
| `createCampaign(data)` | Extract from POST / handler |
| `updateCampaign(id, data)` | **New** — validate fields, `prisma.campaign.update()` |
| `deleteCampaign(id)` | **New** — `prisma.campaign.delete()` |

Services do NOT check authorization — that stays in routes.

**File**: `apps/backend/src/services/campaign.service.ts` (new)

### 3.2 Create `services/ad-slot.service.ts`

| Function | Source |
|---|---|
| `listAdSlots(filters)` | Extract from GET / handler |
| `getAdSlotById(id)` | Extract from GET /:id handler |
| `createAdSlot(data)` | Extract from POST / handler + fix basePrice validation |
| `updateAdSlot(id, data)` | **New** |
| `deleteAdSlot(id)` | **New** |
| `bookAdSlot(id, sponsorId)` | Extract from POST /:id/book handler |
| `unbookAdSlot(id)` | Extract from POST /:id/unbook handler |

**File**: `apps/backend/src/services/ad-slot.service.ts` (new)

### 3.3 Add `PUT /api/campaigns/:id`

- Middleware: `requireAuth`, `roleMiddleware(['SPONSOR'])`
- Ownership: verify `campaign.sponsorId === req.user.sponsorId`, else 403
- Validate: name, budget (positive), dates, status transitions
- Return 200

### 3.4 Add `DELETE /api/campaigns/:id`

- Middleware: `requireAuth`, `roleMiddleware(['SPONSOR'])`
- Ownership check → `campaignService.deleteCampaign(id)` → 204

### 3.5 Add `PUT /api/ad-slots/:id`

- Middleware: `requireAuth`, `roleMiddleware(['PUBLISHER'])`
- Ownership: verify `adSlot.publisherId === req.user.publisherId`
- Validate: name, type (enum), basePrice > 0, dimensions
- Return 200

### 3.6 Add `DELETE /api/ad-slots/:id`

- Middleware: `requireAuth`, `roleMiddleware(['PUBLISHER'])`
- Ownership check → 204

### 3.7 Fix `POST /api/ad-slots` bugs

- Add `basePrice > 0` validation
- Use `req.user.publisherId` instead of body `publisherId`

### 3.8 Refactor existing handlers to use services

Replace inline Prisma calls in GET/POST with service calls. Routes become: parse input → auth/ownership → call service → return response.

---

## Phase 4 (Future): Frontend Server Actions (Challenge 05)

Not implemented now, but the architecture enables it cleanly:

- `apps/frontend/app/dashboard/sponsor/actions.ts` — `'use server'` mutations via `serverApi`
- `apps/frontend/app/dashboard/publisher/actions.ts` — same for ad-slots
- Update `server-api.ts` to handle 204 responses
- Add update/delete types to `frontend/lib/types.ts`
- Build form UI with `useActionState` + `useFormStatus`

---

## Implementation Order

| Step | What | Challenge | Depends on | Parallelizable |
|------|------|-----------|------------|----------------|
| 1.1 | Types (AuthUser, errors) | 03 | — | Yes |
| 1.2 | Rewrite auth.ts | 03 | 1.1 | — |
| 1.3 | Auth service | 03 | 1.1 | With 1.2 |
| 1.4 | Fix CORS | 03 | — | Yes |
| 1.5 | Fix frontend api.ts | 03 | — | Yes |
| 1.6 | Error handler middleware | 03 | 1.1 | With 1.2, 1.3 |
| 1.7–1.9 | Redis infra + deps | 03 | — | Yes |
| 1.10 | Rate limiter middleware | 03 | 1.7–1.9 | — |
| 1.11 | Mount rate limiters in index.ts | 03 | 1.10 | — |
| 2.1 | Auth on campaign routes | 03 | 1.2, 1.3 | — |
| 2.2 | Auth on ad-slot routes | 03 | 1.2, 1.3 | With 2.1 |
| 2.3 | Wire up /auth/me | 03 | 1.2 | With 2.1, 2.2 |
| 2.4 | Protect /auth/role/:userId | 03 | 1.3 | With 2.1, 2.2 |
| 3.1 | Campaign service | 04 | — | With Phase 2 |
| 3.2 | Ad-slot service | 04 | — | With 3.1 |
| 3.3 | PUT /campaigns/:id | 04 | 2.1, 3.1 | — |
| 3.4 | DELETE /campaigns/:id | 04 | 2.1, 3.1 | With 3.3 |
| 3.5 | PUT /ad-slots/:id | 04 | 2.2, 3.2 | With 3.3, 3.4 |
| 3.6 | DELETE /ad-slots/:id | 04 | 2.2, 3.2 | With 3.5 |
| 3.7 | Fix POST /ad-slots | 04 | 2.2, 3.2 | With 3.5, 3.6 |
| 3.8 | Refactor handlers → services | 04 | 3.1, 3.2 | — |

---

## Verification

### Challenge 03

```bash
# Unauthenticated → 401
curl -s http://localhost:4291/api/campaigns | jq .

# Authenticated → user's campaigns only
curl -s http://localhost:4291/api/campaigns \
  -H "Cookie: <session-cookie>" | jq .

# /auth/me returns user info
curl -s http://localhost:4291/api/auth/me \
  -H "Cookie: <session-cookie>" | jq .

# Cross-user access → 403
curl -s http://localhost:4291/api/campaigns/<other-id> \
  -H "Cookie: <session-cookie>" | jq .
```

### Challenge 04

```bash
# Update
curl -X PUT http://localhost:4291/api/campaigns/<id> \
  -H "Cookie: <session-cookie>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated", "budget": 5000}'

# Delete → 204
curl -X DELETE http://localhost:4291/api/campaigns/<id> \
  -H "Cookie: <session-cookie>"

# Prisma Studio
pnpm --filter @anvara/backend db:studio
```

### End-to-end

- Frontend sponsor dashboard loads campaigns (server-side fetch from Ch02)
- Login → redirect → dashboard flow works
- No console errors
