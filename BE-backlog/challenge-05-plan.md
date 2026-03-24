# Challenge 05 — Server Actions: Implementation Plan

## Context

Challenges 03 (API Security) and 04 (CRUD Operations) are complete. The backend has fully secured, tested CRUD endpoints for campaigns and ad-slots. Challenge 05 adds frontend mutation capabilities — create, edit, and delete — to both dashboards using Next.js Server Actions.

**Current state:**
- **Sponsor dashboard**: Server-side fetching via `data.ts`, presentational `CampaignList` + `CampaignCard`, has `loading.tsx` + `error.tsx`. No mutation UI.
- **Publisher dashboard**: Still uses client-side `useEffect` fetching in `ad-slot-list.tsx` (inconsistent with sponsor). Has `error.tsx` but no `loading.tsx`. No mutation UI.
- **Backend**: All CRUD endpoints ready (POST/PUT/DELETE for both resources). `server-api.ts` already handles 204 responses and error body parsing.
- **Stack**: Next.js 16.1.3, React 19.2.3, Better Auth

---

## Architecture Decisions

### 1. Action files: Split by operation

Each dashboard gets an `actions/` directory with one file per operation (create, update, delete). A single `actions.ts` handling all three operations easily exceeds the 150-line limit. The backend already models this split (mutation-routes.ts vs query-routes.ts).

### 2. Form UI: Modal dialogs for create/edit, inline confirm for delete

Dashboards are single-page lists with no detail routes. Modals keep users on the list and work naturally with `revalidatePath()` — the list refreshes when the modal closes.

### 3. No shared generic form wrapper

Each domain gets its own form component. Campaign fields (dates, budget, rates, status, categories) differ too much from ad-slot fields (type enum, dimensions, basePrice). Only a shared `SubmitButton` using `useFormStatus` is extracted.

### 4. Type organization

`ActionState` (shared return shape) → `lib/action-types.ts`. Domain-specific FormData parsing stays in each action file.

### 5. Error handling: Structured ActionState returns

Server Actions catch errors and return `{ success, error?, fieldErrors? }`. Actions never throw. Forms display field-level errors inline and general errors as a banner.

### 6. Revalidation, not optimistic updates

`revalidatePath()` after every mutation. The challenge doc specifically calls for this. Optimistic updates add rollback complexity without matching benefit for dashboard CRUD.

### 7. Publisher migration is required

Publisher must migrate from client-side `useEffect` to server-side `data.ts` pattern before actions can work. `revalidatePath('/dashboard/publisher')` triggers a server re-render — if data is fetched client-side, revalidation has no effect.

### 8. `useActionState` (React 19), not `useFormState`

React 19.2.3 renamed `useFormState` to `useActionState` and moved it from `react-dom` to `react`:

```ts
import { useActionState } from 'react';
const [state, formAction, isPending] = useActionState(serverAction, initialState);
```

---

## Auth Pattern in Server Actions

Server Actions run on the Next.js server and must forward the user's session cookies to the Express backend:

```ts
import { headers } from 'next/headers';
import { serverApi } from '@/lib/server-api';

export async function createCampaignAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const requestHeaders = await headers();
  await serverApi('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    requestHeaders, // serverApi extracts cookie + authorization automatically
  });
}
```

Reuses `headers()` from `next/headers` (same pattern as `page.tsx`), passed as `requestHeaders` to `serverApi` which already handles cookie/auth forwarding via `buildServerApiHeaders`.

---

## Implementation Phases

### Phase 0: Infrastructure

| Task | File | Description | Lines |
|------|------|-------------|-------|
| 0.1 | `lib/action-types.ts` | `ActionState` interface + `initialActionState` | ~15 |
| 0.2 | `app/components/submit-button.tsx` | `'use client'` button with `useFormStatus()` | ~30 |
| 0.3 | `app/components/form-modal.tsx` | `'use client'` native `<dialog>` wrapper | ~50 |

### Phase 1: Publisher Dashboard Migration

| Task | File | Description | Lines |
|------|------|-------------|-------|
| 1.1 | `dashboard/publisher/data.ts` | Server-side fetch mirroring sponsor `data.ts` | ~15 |
| 1.2 | `dashboard/publisher/loading.tsx` | Skeleton UI mirroring sponsor `loading.tsx` | ~25 |
| 1.3 | `dashboard/publisher/components/ad-slot-list.tsx` | Rewrite: remove client state, accept props | ~25 |
| 1.4 | `dashboard/publisher/page.tsx` | Call `data.ts`, pass props to `AdSlotList` | ~35 |
| 1.5 | `dashboard/publisher/components/ad-slot-card.tsx` | Remove `'use client'` directive | ~45 |

### Phase 2: Sponsor Server Actions + Forms

| Task | File | Description | Lines |
|------|------|-------------|-------|
| 2.1 | `dashboard/sponsor/actions/create-campaign.ts` | `'use server'`, POST, revalidate | ~70 |
| 2.2 | `dashboard/sponsor/actions/update-campaign.ts` | PUT `/api/campaigns/:id` | ~70 |
| 2.3 | `dashboard/sponsor/actions/delete-campaign.ts` | DELETE, simpler action | ~40 |
| 2.4 | `dashboard/sponsor/components/campaign-form.tsx` | `'use client'`, `useActionState`, create+edit modes | ~120 |
| 2.5 | `dashboard/sponsor/components/create-campaign-button.tsx` | Button + modal trigger | ~30 |
| 2.6 | `dashboard/sponsor/components/campaign-card.tsx` | Add Edit/Delete buttons | ~100 |
| 2.7 | `dashboard/sponsor/page.tsx` | Add `CreateCampaignButton` in header | ~37 |

### Phase 3: Publisher Server Actions + Forms

| Task | File | Description | Lines |
|------|------|-------------|-------|
| 3.1 | `dashboard/publisher/actions/create-ad-slot.ts` | `'use server'`, POST, revalidate | ~60 |
| 3.2 | `dashboard/publisher/actions/update-ad-slot.ts` | PUT `/api/ad-slots/:id` | ~60 |
| 3.3 | `dashboard/publisher/actions/delete-ad-slot.ts` | DELETE | ~35 |
| 3.4 | `dashboard/publisher/components/ad-slot-form.tsx` | `'use client'`, type dropdown, dimensions | ~110 |
| 3.5 | `dashboard/publisher/components/create-ad-slot-button.tsx` | Button + modal trigger | ~30 |
| 3.6 | `dashboard/publisher/components/ad-slot-card.tsx` | Add `'use client'`, Edit/Delete buttons | ~100 |
| 3.7 | `dashboard/publisher/page.tsx` | Add `CreateAdSlotButton` in header | ~37 |

All paths relative to `apps/frontend/`.

---

## Dependency Graph

```
Phase 0 (infrastructure) ─┬─ Phase 1 (publisher migration) ──→ Phase 3 (publisher actions)
                           └─ Phase 2 (sponsor actions)
```

Phase 1 and Phase 2 are independent and can proceed in parallel. Phase 3 requires Phase 1.

---

## Critical Existing Files

| File | Role |
|------|------|
| `lib/server-api.ts` | All Server Actions call this. Handles auth forwarding, 204, error parsing |
| `lib/types.ts` | `Campaign`, `AdSlot`, `AdSlotType`, `CampaignStatus`, input types |
| `lib/auth-helpers.ts` | `getCurrentUserProfile()` used in page.tsx for role checks |
| `dashboard/sponsor/data.ts` | Reference pattern for publisher migration |
| `dashboard/sponsor/loading.tsx` | Reference pattern for publisher loading skeleton |

---

## Conventions

- Named exports only (except Next.js page/layout/error/loading conventions)
- 150-line hard limit per file — split by concern
- `'use server'` at file top, not inline
- `'use client'` only on interactive components
- `import 'server-only'` in `data.ts` files
- CSS variables (`--color-primary`, `--color-border`, `--color-muted`) matching existing patterns
- Actions never throw — always return `ActionState`

---

## Verification

### Sponsor Dashboard
1. Log in as `sponsor@example.com` / `password`
2. Create campaign → appears in list
3. Edit campaign → form pre-populated → updated data shown
4. Delete campaign → confirm → removed from list
5. Empty form → validation errors displayed
6. Submit buttons show "Saving..." / "Deleting..."

### Publisher Dashboard
1. Log in as `publisher@example.com` / `password`
2. Same create/edit/delete flow for ad slots
3. Type dropdown: DISPLAY / VIDEO / NATIVE / NEWSLETTER / PODCAST

### Technical
- `revalidatePath` refreshes data after every mutation
- `pnpm --filter @anvara/frontend typecheck` passes
- `pnpm --filter @anvara/frontend lint` passes
- No console errors
- Prisma Studio reflects all CRUD operations
- Backend 400/403 errors display user-friendly messages in forms
