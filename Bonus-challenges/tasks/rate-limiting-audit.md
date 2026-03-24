# Rate Limiting Audit

## Scope

This audit covers the current Next server actions and Next route handlers in `apps/frontend/app`.

## Summary

- Most current server actions are thin wrappers around the backend API, so they already benefit from the backend `/api` rate limiter.
- That backend protection is still worth keeping, but it was previously keying on the immediate caller IP, which collapses many server-action requests behind the Next server unless client identity is preserved.
- The Next auth route is the main gap today: it does **not** pass through the backend Express limiter and needs its own dedicated rate-limiting strategy.
- Dedicated action-level limits should be added selectively, starting with placement booking and reset flows.

## Findings

| Surface | Current path | Current limiter coverage | Dedicated action/route limiter? | Reason |
|---|---|---|---|---|
| Better Auth route handler | `apps/frontend/app/api/auth/[...all]/route.ts` | **No backend coverage** | **Yes** | High-risk auth entrypoint; bypasses backend Express middleware entirely. |
| Login redirect helper | `apps/frontend/app/login/actions/resolve-login-redirect.ts` | N/A | No | Lightweight redirect resolution; not abuse-prone and does not fan out into expensive work. |
| Create campaign | `apps/frontend/app/dashboard/sponsor/actions/create-campaign.ts` | Backend global limiter | Not yet | Authenticated mutation, but current backend limiter is sufficient for now after client identity preservation. |
| Update campaign | `apps/frontend/app/dashboard/sponsor/actions/update-campaign.ts` | Backend global limiter | Not yet | Same rationale as create campaign. |
| Delete campaign | `apps/frontend/app/dashboard/sponsor/actions/delete-campaign.ts` | Backend global limiter | Not yet | Same rationale as create campaign. |
| Create ad slot | `apps/frontend/app/dashboard/publisher/actions/create-ad-slot.ts` | Backend global limiter | Not yet | Authenticated mutation, but not the highest-abuse flow today. |
| Update ad slot | `apps/frontend/app/dashboard/publisher/actions/update-ad-slot.ts` | Backend global limiter | Not yet | Same rationale as create ad slot. |
| Delete ad slot | `apps/frontend/app/dashboard/publisher/actions/delete-ad-slot.ts` | Backend global limiter | Not yet | Same rationale as create ad slot. |
| Book placement | `apps/frontend/app/marketplace/[id]/actions/book-placement.ts` | Backend global limiter | **Yes, next** | User-facing marketplace action with repeat-submission risk and state mutation. |
| Reset listing | `apps/frontend/app/marketplace/[id]/actions/reset-listing.ts` | Backend global limiter | **Yes, next** | State mutation with potential abuse/admin-style reset behavior. |

## Recommended Order

1. Preserve trusted client identity from Next to backend.
2. Tighten backend limiter keys and trust proxy settings.
3. Add dedicated rate limiting to the Next auth route.
4. Add a shared action-level limiter for `bookPlacementAction` and `resetListingAction`.

## Notes

- A future user-aware backend limiter can safely key by authenticated user when a trusted session is present.
- User-scoped throttling should be kept in shared middleware/helpers, not duplicated across individual actions.
