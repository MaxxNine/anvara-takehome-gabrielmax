# Task 04: API Security (Challenge 03)

## Goal

Secure the backend API so that unauthenticated requests are rejected, users can only access their own data, and the API is protected against abuse. This also included a broader backend architecture refactor to support Challenges 04 and 05.

## What we changed

### Architecture refactor

Before this task, all backend logic lived inline in route handler files with no separation. We introduced a three-layer architecture:

- **Routes** (`src/routes/`) — thin HTTP layer: parse input, check ownership, call service, return response
- **Services** (`src/services/`) — business logic and Prisma queries, no HTTP awareness
- **Middleware** (`src/middleware/`, `src/auth.ts`) — cross-cutting concerns: auth, error handling, rate limiting

We also split types by domain instead of using a single monolithic types file:

```
src/types/
├── index.ts      (barrel re-exports only)
├── auth.ts       (AuthUser, AuthRequest, AuthProfileResponse)
├── errors.ts     (HttpError, NotFoundError, ValidationError, ForbiddenError)
├── campaign.ts   (campaign-specific input types)
└── ad-slot.ts    (ad-slot-specific input types)
```

Guidelines for this architecture are documented in `AGENTS_BE.md` at the project root.

### Authentication middleware

- Rewrote `src/auth.ts` with a real Better Auth server instance (mirrors the frontend's config — same DB, same secret)
- `requireAuth` middleware validates the session cookie via `auth.api.getSession()`, resolves the user's role (sponsor/publisher) by querying the database, and attaches the full `AuthUser` to `req.user`
- `roleMiddleware` factory restricts endpoints to specific roles (e.g., only sponsors can create campaigns)
- Express headers are converted to web-standard `Headers` via `fromNodeHeaders()` for Better Auth compatibility

### Auth service

- Extracted role resolution into `src/services/auth/auth.service.ts` with `resolveUserRole()` — queries `prisma.sponsor` then `prisma.publisher` by userId
- Added `getAuthProfile()` for the frontend identity bootstrap endpoint
- Domain-specific helpers co-located in `src/services/auth/auth.helpers.ts` (role assignment to profile response mapping)

### Secured routes

Applied `requireAuth` to all campaign and ad-slot routes with role-based access:

- **Campaigns**: sponsors see only their own campaigns; publishers can browse all (cross-role read for marketplace). POST restricted to sponsors using `req.user.sponsorId` (body `sponsorId` ignored).
- **Ad slots**: publishers see only their own slots; sponsors can browse all available. POST restricted to publishers using `req.user.publisherId`. Booking restricted to sponsors.
- **Ownership on GET /:id**: returns 404 (not 403) when a user doesn't own the resource — avoids leaking resource existence.

### Auth endpoints

Three auth endpoints now exist, each with a distinct purpose:

- `GET /auth/me` — returns the raw `AuthUser` principal. Intended for API clients and programmatic access.
- `GET /auth/profile` — returns a frontend-friendly identity payload (`{ role: 'sponsor', sponsorId, name }`). Used by the frontend for post-login redirect, nav links, and domain entity display name. This is separate from `/me` because the frontend needs lowercase role strings and the domain entity name, which are UI concerns that don't belong on the auth principal.
- `GET /auth/role/:userId` — deprecated compatibility wrapper. Protected with `requireAuth`, validates the userId matches the caller, sends a `Deprecation` header. Kept because 6 frontend callsites still use it. Migration to `/auth/profile` can happen incrementally.

### CORS fix

Changed `app.use(cors())` to specify `origin` and `credentials: true`. Without this, the browser refuses to send cookies cross-origin (frontend on :3847, backend on :4291).

### Frontend credentials

Added `credentials: 'include'` to the client-side API helper (`apps/frontend/lib/api.ts`) so the browser sends the Better Auth session cookie with every request to the backend.

### Rate limiting

- Added a Redis container to `docker-compose.yml` (`redis:7-alpine`, port 6379)
- Implemented two rate limiters in `src/middleware/rate-limiter.ts`:
  - **Global**: 100 requests per 15-minute window per IP, applied to all `/api` routes
  - **Auth**: 10 requests per 15-minute window per IP, applied to `/api/auth` routes (brute-force protection)
- Both use a Redis store (`rate-limit-redis` + `ioredis`) so state persists across server restarts
- Graceful fallback to in-memory store if Redis is unavailable (logs warning once, doesn't crash)
- Returns `429 Too Many Requests` with `Retry-After` header

### Centralized error handling

Created `src/middleware/error-handler.ts` that catches typed errors (`NotFoundError` → 404, `ValidationError` → 400, `ForbiddenError` → 403) and maps them to JSON responses. Route handlers use `next(error)` to delegate instead of repeating try/catch blocks. Dev mode logs full errors; production hides internals.

## Scope and decisions

### What we secured

- Campaign routes (GET list, GET :id, POST)
- Ad-slot routes (GET list, GET :id, POST, book, unbook)
- Auth routes (/me, /profile, /role/:userId)

### What we intentionally left unprotected

- `GET /api/health` — health checks must be accessible for monitoring
- `GET /api/dashboard/stats` — aggregate platform metrics, no user-specific data

### What remains for Challenge 04

- Sponsors, publishers, and placements routes are not yet protected. These routes will get `requireAuth` when we refactor them to use the service layer and add missing CRUD endpoints.
- The challenge doc scoped security to campaign and ad-slot routes specifically. Protecting the remaining routes is a natural extension during Challenge 04.

### Key design decisions

1. **`/auth/me` vs `/auth/profile` vs `/auth/role/:userId`** — kept all three because they serve different contracts. `/me` is the internal auth principal (for API clients), `/profile` is the frontend identity bootstrap (lowercase roles, domain entity name), and `/role/:userId` is deprecated but still has 6 frontend callsites.

2. **Cross-role reads allowed** — sponsors can browse ad-slots (needed to discover slots to book), publishers can browse campaigns. Mutations are strictly scoped to owned resources.

3. **404 over 403 for ownership denial on GETs** — prevents resource existence enumeration. If you don't own it, you get 404 as if it doesn't exist.

4. **Services don't check authorization** — ownership and role checks live in the route layer. Services are pure data/logic, making them reusable and testable without HTTP context.

5. **Redis for rate limiting** — even though in-memory would suffice locally, Redis demonstrates production readiness and state persistence across server restarts.

6. **Auth service as a subdirectory** — `services/auth/` has its own `index.ts`, `auth.service.ts`, and `auth.helpers.ts` because role resolution + profile transformation justified the split per AGENTS_BE.md file size guidelines.

## Files changed

### New files
- `apps/backend/src/types/auth.ts`
- `apps/backend/src/types/errors.ts`
- `apps/backend/src/types/campaign.ts`
- `apps/backend/src/types/ad-slot.ts`
- `apps/backend/src/types/index.ts`
- `apps/backend/src/services/auth/auth.service.ts`
- `apps/backend/src/services/auth/auth.helpers.ts`
- `apps/backend/src/services/auth/index.ts`
- `apps/backend/src/middleware/error-handler.ts`
- `apps/backend/src/middleware/rate-limiter.ts`
- `AGENTS_BE.md`
- `BE-backlog/implementation-plan.md`
- `BE-backlog/tasks.md`

### Modified files
- `apps/backend/src/auth.ts` (rewritten — Better Auth instance + requireAuth)
- `apps/backend/src/index.ts` (CORS fix, rate limiter mounting, error handler)
- `apps/backend/src/routes/auth.ts` (real /me, new /profile, deprecated /role/:userId)
- `apps/backend/src/routes/campaigns.ts` (requireAuth + role checks + ownership)
- `apps/backend/src/routes/adSlots.ts` (requireAuth + role checks + ownership)
- `apps/frontend/lib/api.ts` (credentials: 'include')
- `docker-compose.yml` (Redis service)
- `.env` (REDIS_URL)
- `apps/backend/package.json` (new deps: express-rate-limit, rate-limit-redis, ioredis)

## Result

- Unauthenticated requests to campaign and ad-slot routes return 401
- Authenticated sponsors see only their own campaigns
- Authenticated publishers see only their own ad-slots
- Cross-role browsing works (sponsors browse ad-slots, publishers browse campaigns)
- `/auth/me` returns the auth principal when authenticated
- `/auth/profile` returns the frontend identity payload
- Rate limiter returns 429 when limits are exceeded
- Redis state persists across server restarts
- Frontend login → dashboard flow works end-to-end
- Architecture follows AGENTS_BE.md guidelines throughout
