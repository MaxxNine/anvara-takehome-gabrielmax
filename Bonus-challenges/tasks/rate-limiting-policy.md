# Rate Limiting Policy

## Scope

This policy documents the implemented rate-limiting boundaries across the backend API, Next server actions, and the Next auth route.

## Backend API Policy

### Entry point

- `apps/backend/src/index.ts`
- `apps/backend/src/middleware/rate-limiter.ts`

### Limits

- Global API limiter:
  - scope: all `/api` routes
  - window: 15 minutes
  - limit: 100 requests
- Auth API limiter:
  - scope: `/api/auth` routes on the Express backend
  - window: 15 minutes
  - limit: 10 requests

### Keys

- Authenticated requests: `user:<userId>`
- Anonymous requests: trusted client IP

### Trust boundary

- Express honors forwarded IPs only through the configured `trust proxy` setting in `apps/backend/src/config/trust-proxy.ts`.
- The frontend preserves `x-forwarded-for` and `x-real-ip` when calling the backend from server actions in `apps/frontend/lib/server-api.ts`.

## Next Server-Action Policy

### Entry point

- `apps/frontend/lib/rate-limit/server-action-rate-limit.ts`

### Storage

- Primary: Redis via `apps/frontend/lib/rate-limit/redis.ts`
- Fallback: in-memory counters per process

### Keys

- Authenticated actions: `user:<userId>`
- Anonymous actions: client IP from forwarded request headers

### Prefix

- Redis key prefix: `anvara:rate-limit:server-action:`

### Applied limits

- `bookPlacementAction`
  - scope: `marketplace:book-placement`
  - window: 15 minutes
  - limit: 10 requests
- `resetListingAction`
  - scope: `marketplace:reset-listing`
  - window: 15 minutes
  - limit: 15 requests

## Next Auth Route Policy

### Entry point

- `apps/frontend/app/api/auth/[...all]/route.ts`
- `apps/frontend/app/api/auth/[...all]/auth-rate-limit.ts`

### Storage

- Primary: Redis via the same frontend rate-limit Redis client
- Fallback: in-memory counters per process

### Prefix

- Redis key prefix: `anvara:rate-limit:route:`

### Route classes

- Read-only auth requests:
  - actor: authenticated user when available, otherwise IP
  - scope: `auth:get`
  - window: 15 minutes
  - limit: 120 requests
- Credential entry requests such as `/sign-in/*` and `/sign-up/*`:
  - actor: IP only
  - scope: `auth:credential-entry`
  - window: 15 minutes
  - limit: 10 requests
- Recovery-style requests such as password reset and email verification endpoints:
  - actor: IP only
  - scope: `auth:recovery`
  - window: 15 minutes
  - limit: 10 requests
- Sign-out requests:
  - actor: authenticated user when available, otherwise IP
  - scope: `auth:sign-out`
  - window: 15 minutes
  - limit: 30 requests
- Other auth mutations:
  - actor: authenticated user when available, otherwise IP
  - scope: `auth:mutation`
  - window: 15 minutes
  - limit: 60 requests

## Error Surface

- Limited requests return:
  - status: `429`
  - body: `{ "error": "Too many requests, please try again later" }`
  - header: `Retry-After`
- Server actions normalize rate-limit failures through `apps/frontend/lib/action-helpers.ts`
- UI surfaces render them consistently through `apps/frontend/app/components/action-error-notice.tsx`

## Fallback Behavior

- If Redis is unavailable:
  - backend API limiting falls back to in-memory counters
  - frontend server-action limiting falls back to in-memory counters
  - frontend auth-route limiting falls back to in-memory counters
- Fallback is graceful and logs once per process instead of failing closed.

## Verification

- Backend keying tests:
  - `apps/backend/src/middleware/rate-limit-key.test.ts`
- Frontend action limiter tests:
  - `apps/frontend/lib/rate-limit/server-action-rate-limit.test.ts`
- Frontend auth-route limiter tests:
  - `apps/frontend/app/api/auth/[...all]/auth-rate-limit.test.ts`
- Frontend `429` normalization tests:
  - `apps/frontend/lib/action-helpers.test.ts`
