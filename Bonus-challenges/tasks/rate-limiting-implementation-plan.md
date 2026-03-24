# Rate Limiting Implementation Plan

## Goal

Add clean, explicit rate-limiting boundaries for the Next frontend and backend API without scattering limiter logic across pages, components, or individual actions.

## Current State

- Backend API traffic is rate-limited in `apps/backend/src/index.ts` via middleware from `apps/backend/src/middleware/rate-limiter.ts`.
- Frontend server actions currently call the backend through `apps/frontend/lib/server-api.ts`.
- This means server actions do pass through the backend limiter, but the backend may only see the Next server as the caller unless we preserve trusted client identity.
- Sensitive frontend server actions now have a dedicated limiter, and the Next auth route now has its own dedicated route limiter because it bypasses the backend Express middleware.

## Design Principles

- Keep server actions thin; shared limiter logic belongs in server-only helpers.
- Do not add action-level throttling to every mutation by default. Add it where abuse risk, cost, or fan-out justifies it.
- Prefer stable keys over raw IP when the user is authenticated.
- Keep fallback behavior graceful if Redis is unavailable; do not turn infrastructure hiccups into a full outage.
- Maintain one documented policy for how limits are keyed, enforced, surfaced, and verified.

## Target Architecture

### Backend API limiter

- Continue enforcing a global API limiter and stricter per-scope limiters in Express middleware.
- Improve the key strategy so the backend can distinguish real clients even when requests come through Next server actions.
- Use:
  - authenticated key: `user:<userId>`
  - anonymous key: trusted client IP

### Frontend server-action limiter

- Add a server-only rate-limit helper in the frontend app.
- Use it only for sensitive or expensive actions that should be stopped before they fan out into backend work.
- Keep the helper reusable and framework-agnostic from the component perspective.

## Proposed File Layout

- `apps/frontend/lib/rate-limit/server-action-rate-limit.ts`
- `apps/frontend/lib/rate-limit/redis.ts`
- `apps/frontend/lib/server-api.ts`
- `apps/frontend/lib/action-helpers.ts`
- `apps/backend/src/index.ts`
- `apps/backend/src/middleware/rate-limiter.ts`

If shared infra starts duplicating across apps, promote it into a dedicated shared package later instead of repeating utilities.

## Phase 1: Preserve Client Identity

1. Update `apps/frontend/lib/server-api.ts` to forward trusted client identity headers when the request originates from the browser through Next.
2. Decide which headers are acceptable in this environment:
   - `x-forwarded-for`
   - `x-real-ip`
   - platform-specific headers only if they are actually present and trusted
3. Update backend trust configuration so Express only relies on forwarded headers when the proxy boundary is explicit and safe.
4. Update the backend limiter key generator to prefer:
   - authenticated user id when available
   - otherwise trusted client IP

### Success Criteria

- Requests coming from different browser clients through Next do not collapse into one shared rate-limit bucket.
- Authenticated users are not bucketed only by IP.

## Phase 2: Shared Server-Action Limiter

1. Add a server-only limiter helper in the frontend app.
2. Back it with Redis when available.
3. Mirror the backend fallback philosophy:
   - log once
   - degrade gracefully
   - avoid crashing user-facing flows
4. Define a small API such as:

```ts
await enforceActionRateLimit({
  key: `user:${userId}:book-placement`,
  limit: 10,
  windowMs: 15 * 60 * 1000,
});
```

### Success Criteria

- Actions can opt into rate limiting without duplicating Redis or window logic.
- Limiter behavior stays in server-only code.

## Phase 3: Apply Limits Selectively

Start with the most abuse-prone or operationally expensive actions.

### First candidates

- `bookPlacementAction`
- `resetListingAction`
- future auth recovery or email-triggering actions
- future payment, export, import, or AI-generation actions

### Not immediate candidates

- harmless read-only server actions
- redirect-resolution or lightweight convenience actions that do not mutate or fan out

### Success Criteria

- High-risk actions fail fast with `429` before unnecessary downstream work.
- Low-risk actions are not cluttered with premature limiter code.

## Phase 4: Error Handling and UX

1. Normalize `429` handling in shared action helpers.
2. Return a consistent action state or error shape for rate-limited actions.
3. Show concise UI feedback such as:
   - "Too many requests, please try again later."
4. Avoid leaking internal limiter details in the UI.

### Success Criteria

- Rate-limit failures are distinguishable from validation and authorization failures.
- Components do not need custom one-off `429` parsing.

## Phase 5: Verification

1. Add backend verification for:
   - global limiter threshold
   - auth-specific limiter threshold
   - trusted key generation
2. Add frontend verification for:
   - server-action limiter threshold
   - graceful fallback when Redis is unavailable
   - consistent `429` action-state handling
3. Document exact limits and expected retry behavior.

## Open Decisions

- Whether frontend server actions should reuse the same Redis namespace as the backend or use a dedicated prefix.
- Whether action-level limits should be keyed strictly by user id, by user plus action name, or by a hybrid user/IP strategy.
- Whether some actions are sufficiently protected by backend API limiting alone and should remain unthrottled at the Next layer.

## Implemented Status

- Client identity is preserved from Next to the backend API.
- Backend API limits key by authenticated user when available and trusted client IP otherwise.
- Marketplace booking and reset server actions have dedicated action-level throttling.
- The Next auth route has dedicated throttling with stricter limits for credential-entry and recovery flows.
- Shared `429` handling and focused verification are in place.

## Recommended Execution Order

1. Preserve client identity from Next to backend.
2. Tighten backend limiter key generation and trust boundaries.
3. Introduce the shared frontend server-action limiter.
4. Apply it to the first sensitive actions only.
5. Normalize `429` handling.
6. Add tests and documentation.
