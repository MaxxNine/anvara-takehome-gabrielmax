# Challenge 05 — Server Actions (Complete)

## Overview

Added full CRUD capabilities to both dashboards (sponsor campaigns, publisher ad slots) using Next.js Server Actions. Migrated the publisher dashboard from client-side data fetching to server-side rendering to enable `revalidatePath` cache invalidation.

**Stack**: Next.js 16.1.3, React 19.2.3, Zod 4.3, Better Auth, Tailwind CSS v4

---

## What Was Done

### Phase 0: Infrastructure

Created shared building blocks used across both dashboards.

| File | Purpose |
|------|---------|
| `lib/action-types.ts` | `ActionState` type (`success`, `error?`, `fieldErrors?`, `fieldValues?`) + `initialActionState` constant |
| `lib/action-helpers.ts` | `handleActionError()` — centralizes catch-block logic, redirects to `/login` on 401 |
| `lib/schemas/campaign.ts` | Zod schemas: `campaignSchema` (create), `updateCampaignSchema` (update + status) |
| `lib/schemas/ad-slot.ts` | Zod schemas: `adSlotSchema` (create), `updateAdSlotSchema` (update + id) |
| `lib/schemas/utils.ts` | `extractFieldValues()` for form preservation, `validationError()` to map Zod errors → `ActionState` |
| `app/components/submit-button.tsx` | `'use client'` button with `useFormStatus()`, `variant` prop (primary/danger) |
| `app/components/form-modal.tsx` | `'use client'` native `<dialog>` wrapper with backdrop click + escape key handling |

### Phase 1: Publisher Dashboard Migration

Migrated publisher from client-side `useEffect` fetching to server-side `data.ts` pattern. **Required before Phase 3** — `revalidatePath` only works when data is fetched server-side.

| File | Change |
|------|--------|
| `dashboard/publisher/data.ts` | New — server-side fetch with `serverApi`, mirrors sponsor `data.ts` |
| `dashboard/publisher/loading.tsx` | New — skeleton UI for Suspense |
| `dashboard/publisher/components/ad-slot-list.tsx` | Rewritten — removed `'use client'`, `useEffect`, `useState`; now accepts `adSlots` as prop |
| `dashboard/publisher/page.tsx` | Updated — calls `data.ts` server-side, passes props to `AdSlotList` |

### Phase 2: Sponsor CRUD (Campaigns)

| File | Purpose |
|------|---------|
| `dashboard/sponsor/actions/create-campaign.ts` | Server Action — Zod validation, POST `/api/campaigns`, `revalidatePath` |
| `dashboard/sponsor/actions/update-campaign.ts` | Server Action — PUT `/api/campaigns/:id`, handles status field |
| `dashboard/sponsor/actions/delete-campaign.ts` | Server Action — DELETE `/api/campaigns/:id` |
| `dashboard/sponsor/components/campaign-form.tsx` | `'use client'` form — `useActionState`, create + edit modes, field preservation on error |
| `dashboard/sponsor/components/create-campaign-button.tsx` | Button + conditional `<FormModal>` rendering |
| `dashboard/sponsor/components/campaign-card.tsx` | Added Edit (modal) + Delete (inline confirm) buttons |
| `dashboard/sponsor/page.tsx` | Added `CreateCampaignButton` in header |

### Phase 3: Publisher CRUD (Ad Slots)

Mirrors Phase 2 structure for ad slots.

| File | Purpose |
|------|---------|
| `dashboard/publisher/actions/create-ad-slot.ts` | Server Action — Zod validation, POST `/api/ad-slots`, `revalidatePath` |
| `dashboard/publisher/actions/update-ad-slot.ts` | Server Action — PUT `/api/ad-slots/:id` |
| `dashboard/publisher/actions/delete-ad-slot.ts` | Server Action — DELETE `/api/ad-slots/:id` |
| `dashboard/publisher/components/ad-slot-form.tsx` | `'use client'` form — type dropdown (5 options), optional dimensions |
| `dashboard/publisher/components/create-ad-slot-button.tsx` | Button + conditional `<FormModal>` rendering |
| `dashboard/publisher/components/ad-slot-card.tsx` | Added Edit (modal) + Delete (inline confirm) buttons |
| `dashboard/publisher/page.tsx` | Added `CreateAdSlotButton` in header |

### Phase 4: API Layer Improvements

| File | Change |
|------|--------|
| `lib/server-api.ts` | Added `ApiError` class with typed `status` and semantic getters (`isUnauthorized`, `isForbidden`, `isNotFound`, `isValidation`) |
| `lib/action-helpers.ts` | `handleActionError()` replaces repetitive catch blocks across all 6 actions; redirects to `/login` on 401 |

---

## Architecture Decisions

### 1. Zod for frontend validation (not manual `if` checks)

**Decision**: Use Zod schemas with `safeParse()` + `error.flatten().fieldErrors`.

**Why**: Manual validation (`if (!name) errors.name = [...]`) was verbose, error-prone, and duplicated across create/update actions. Zod gives us:
- `z.coerce.number()` handles string → number parsing from FormData automatically
- `z.union([z.literal(''), z.coerce.number().positive()])` handles optional numeric fields (empty string from form = no value)
- `.refine()` for cross-field validation (endDate >= startDate)
- `error.flatten().fieldErrors` gives `Record<string, string[]>` — directly matches our `ActionFieldErrors` type
- Schemas are reusable and testable independently of actions

**Why NOT Zod on the backend**: The backend's custom validation utilities (`parsePartialFields`, `hasField`, `parseNonEmptyString`) handle PUT semantics where "field missing" vs "field sent as null" is a meaningful distinction. Zod's `.partial()` can't distinguish these. The backend business logic (status transitions, date range assertions) would remain custom code on top of Zod anyway.

### 2. `cache: 'no-store'` (not tag-based caching)

**Decision**: Keep `cache: 'no-store'` on all `serverApi` calls + `revalidatePath()` for invalidation.

**Why**: All API endpoints return **user-specific data behind auth**. Next.js Data Cache keys by URL only — not by cookies or headers. Caching `/api/campaigns` with `next: { tags: ['campaigns'] }` could serve User A's campaigns to User B. `cache: 'no-store'` is the correct and safe choice for authenticated endpoints.

Tag-based caching (`revalidateTag`) would be appropriate for **public/shared data** (e.g., a marketplace listing visible to all users), not for dashboard data scoped to the authenticated user.

### 3. `revalidatePath` (not optimistic updates, not TanStack Query)

**Decision**: Server-side revalidation after every mutation. No client-side data fetching library.

**Why**:
- `revalidatePath` triggers a fresh server-side render → data is always consistent with the database
- TanStack Query solves **client-side** caching (deduplication, background refetching, stale-while-revalidate). We fetch server-side in Server Components, so it would be redundant — a client-side cache on top of a server-side cache
- Optimistic updates add rollback complexity (what if the mutation fails?) without meaningful UX benefit for dashboard CRUD where a 200ms round-trip is acceptable
- TanStack Query would only be justified for: real-time data with polling, complex interdependent client state, or pages where perceived latency of mutations is critical

### 4. `ApiError` with typed status codes

**Decision**: `serverApi` throws `ApiError(message, status)` instead of generic `Error`.

**Why**: Different HTTP statuses require different handling:
- **401** → session expired → `redirect('/login')` (not a form error message)
- **400** → backend validation error → show `error.message` in form
- **403** → forbidden → show permission error
- **500** → server error → show generic fallback

All 6 actions previously had identical catch blocks (`error instanceof Error ? error.message : 'fallback'`). Now they call `handleActionError(error, fallback, fieldValues)` which handles 401 redirect automatically.

### 5. `fieldValues` for form preservation on validation errors

**Decision**: Actions return `fieldValues: Record<string, string>` alongside `fieldErrors` on every error path. Forms use `state.fieldValues?.field ?? entity?.field ?? ''` for `defaultValue`.

**Why**: React 19's `useActionState` resets form inputs after the action completes — even on errors. Without `fieldValues`, a user who fills 8 fields and triggers a date validation error loses all their input. The priority chain is:
1. `state.fieldValues` — preserved from the failed submission
2. Entity prop (e.g., `campaign?.name`) — edit mode initial values
3. Empty string — create mode

### 6. Conditional modal rendering for state reset

**Decision**: `{editOpen && <FormModal>...}` instead of always-mounted modals.

**Why**: After a successful edit, `state.success` is `true` in the `useActionState`. If the modal stays mounted, reopening it triggers the `useEffect(() => { if (state.success) onClose() })` immediately — the modal flashes open and closes. Conditional rendering unmounts the form on close, so reopening creates a fresh component with `initialActionState`.

### 7. Direct Tailwind classes for button colors (not CSS variables)

**Decision**: `SubmitButton` uses a `variant` prop (`'primary'` → `bg-indigo-500`, `'danger'` → `bg-red-600`) instead of `bg-[--color-primary]`.

**Why**: Tailwind v4 CSS variables (`bg-[--color-primary]`) don't reliably resolve inside `<dialog>` elements. The dialog creates a new stacking context where the CSS custom property inheritance can break. Direct utility classes always work.

### 8. `useActionState` (React 19), not `useFormState`

**Decision**: Import from `'react'`, not `'react-dom'`.

**Why**: React 19.2.3 renamed `useFormState` to `useActionState` and moved it to the `react` package. The old import from `react-dom` is deprecated.

```ts
// Correct (React 19)
import { useActionState } from 'react';
const [state, formAction] = useActionState(action, initialActionState);

// Deprecated
import { useFormState } from 'react-dom';
```

### 9. Split action files by operation

**Decision**: One file per operation (`create-campaign.ts`, `update-campaign.ts`, `delete-campaign.ts`) rather than a single `actions.ts`.

**Why**: A combined file handling create + update + delete + validation exceeds the 150-line file limit. Each action is self-contained with its own Zod schema import and field extraction. The backend already models this split.

---

## File Map

All paths relative to `apps/frontend/`.

```
lib/
├── action-types.ts          — ActionState type + initialActionState
├── action-helpers.ts         — handleActionError() with 401 redirect
├── server-api.ts             — serverApi() + ApiError class
├── schemas/
│   ├── campaign.ts           — Zod schemas: campaignSchema, updateCampaignSchema
│   ├── ad-slot.ts            — Zod schemas: adSlotSchema, updateAdSlotSchema
│   └── utils.ts              — extractFieldValues(), validationError()

app/
├── components/
│   ├── submit-button.tsx     — Shared submit button (useFormStatus, variant prop)
│   └── form-modal.tsx        — Native <dialog> wrapper
├── dashboard/
│   ├── sponsor/
│   │   ├── data.ts           — getSponsorCampaigns() (server-side fetch)
│   │   ├── page.tsx          — Server Component, renders CreateCampaignButton
│   │   ├── loading.tsx       — Skeleton UI
│   │   ├── actions/
│   │   │   ├── create-campaign.ts
│   │   │   ├── update-campaign.ts
│   │   │   └── delete-campaign.ts
│   │   └── components/
│   │       ├── campaign-list.tsx
│   │       ├── campaign-card.tsx      — Edit modal + inline delete confirm
│   │       ├── campaign-form.tsx      — useActionState, create/edit modes
│   │       └── create-campaign-button.tsx
│   └── publisher/
│       ├── data.ts           — getPublisherAdSlots() (server-side fetch)
│       ├── page.tsx          — Server Component, renders CreateAdSlotButton
│       ├── loading.tsx       — Skeleton UI
│       ├── actions/
│       │   ├── create-ad-slot.ts
│       │   ├── update-ad-slot.ts
│       │   └── delete-ad-slot.ts
│       └── components/
│           ├── ad-slot-list.tsx
│           ├── ad-slot-card.tsx       — Edit modal + inline delete confirm
│           ├── ad-slot-form.tsx       — useActionState, type dropdown, dimensions
│           └── create-ad-slot-button.tsx
```

---

## Verification (All Passing)

- [x] Sponsor: create, edit, delete campaigns
- [x] Publisher: create, edit, delete ad slots
- [x] Empty form submission shows field-level validation errors
- [x] Form fields preserved on validation errors
- [x] Submit buttons show "Saving..." / "Deleting..." pending states
- [x] `revalidatePath` refreshes data without manual reload
- [x] Backend 400/403 errors display user-friendly messages
- [x] `pnpm --filter @anvara/frontend typecheck` passes (0 errors)
- [x] `pnpm --filter @anvara/frontend lint` passes (0 errors, 4 pre-existing warnings)
- [x] No console errors
- [x] Prisma Studio reflects all CRUD operations
