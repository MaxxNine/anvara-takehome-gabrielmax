# Task 03: Server Components

## Goal

Move the sponsor dashboard read path to the server so data is fetched before render, the browser no longer owns the dashboard waterfall, and the codebase is better prepared for later Server Actions work.

## What we changed

- moved sponsor dashboard campaign loading from client-side `useEffect` to the server page
- converted the sponsor campaign list into a presentational component that receives `campaigns` as props
- added a server-only dashboard read helper for sponsor campaigns
- added a server-only API helper that:
  - prefers non-public backend env vars (`BACKEND_URL`, `API_URL`) before `NEXT_PUBLIC_API_URL`
  - accepts forwarded request headers so backend auth cookies can be passed through later
- updated the shared role helper to use the same server-side API path and forwarded headers
- added route-level `loading.tsx` and `error.tsx` for the sponsor dashboard
- kept the dashboard cards presentational so future create/update/delete work can layer on top cleanly

## Scope and decisions

- reads were moved to standard server-side data fetching, not Server Actions
- Server Actions remain the right fit for future mutations in Challenge 05
- no new product features were added
- no backend auth/security redesign was attempted yet
- the current structure is intended to support Challenge 03 and Challenge 05 without redoing the read path

## Result

Verified outcomes after the refactor:

- sponsor campaigns are fetched on the server before render
- `pnpm --filter @anvara/frontend lint` passes with warnings only
- `pnpm --filter @anvara/frontend typecheck` passes
- root `pnpm lint` passes
- root `pnpm typecheck` passes

## Backend-Off Error Handling

When the backend is stopped, the sponsor dashboard now fails through the route error boundary instead of hanging or crashing the whole app.

That is graceful from a user-flow perspective:

- the page shows the sponsor dashboard fallback UI
- the error is contained by the route boundary
- the user is given a retry path

In development, Next.js still logs the underlying server exception in the console, for example `TypeError: fetch failed`. That is expected dev behavior and does not mean the route-level handling failed.

So the current state is:

- graceful enough for Challenge 02
- not yet polished error UX for production wording

If we want a cleaner production-facing message later, we should translate low-level fetch errors into domain-specific errors before they reach the boundary UI.
