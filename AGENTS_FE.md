# Frontend Agent Guidelines

Guidelines for agents implementing frontend tasks. Read this before writing any code.

## Architecture

### Next.js App Router — Server-First

This is a **Next.js 16** App Router application with **React 19**. Server Components are the default. Client Components are the exception.

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Pages** | `app/[feature]/page.tsx` | Server Components: auth checks, data fetching, layout |
| **Data** | `app/[feature]/data.ts` | Server-only data fetching functions (`import 'server-only'`) |
| **Actions** | `app/[feature]/actions/*.ts` | `'use server'` mutation functions (one file per operation) |
| **Components** | `app/[feature]/components/*.tsx` | UI components (server or client depending on interactivity) |
| **Shared** | `app/components/*.tsx` | Cross-feature UI components |
| **Lib** | `lib/*.ts` | Utilities, API clients, types — no React, no JSX |

### Server vs Client Components

**Default to Server Components.** Only add `'use client'` when the component genuinely needs:
- `useState`, `useEffect`, `useRef`, or other React hooks
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`window`, `localStorage`, `IntersectionObserver`)
- Third-party client-only libraries

**The `'use client'` boundary should be as deep as possible.** Don't mark an entire page as `'use client'` because one button needs state. Extract the interactive part into its own client component and keep the parent as a server component.

```
# Good — boundary pushed down
page.tsx              (server: fetches data, renders layout)
└── campaign-list.tsx (server: maps data to cards)
    └── campaign-card.tsx ('use client': has edit/delete buttons with state)

# Bad — boundary too high
page.tsx ('use client': everything is client-rendered)
```

### Data Flow

```
Server Component (page.tsx)
  ├── calls data.ts for reads (server-only, cookie forwarding)
  ├── passes data as props to child components
  └── renders Server Action forms for writes

Client Component (form.tsx)
  ├── uses useActionState(serverAction, initialState) for form state
  ├── uses useFormStatus() for pending indicators
  └── calls server actions via <form action={formAction}>
```

**Never fetch data inside client components with `useEffect`.** This pattern bypasses SSR, breaks `revalidatePath()`, and creates loading waterfalls. Use `data.ts` files and pass data as props instead.

---

## File Organization

### Directory Structure

```
apps/frontend/
├── app/
│   ├── components/           # Shared UI (nav, submit-button, form-modal)
│   ├── dashboard/
│   │   ├── sponsor/
│   │   │   ├── actions/      # Server Actions (one per operation)
│   │   │   │   ├── create-campaign.ts
│   │   │   │   ├── update-campaign.ts
│   │   │   │   └── delete-campaign.ts
│   │   │   ├── components/   # Feature-specific components
│   │   │   │   ├── campaign-card.tsx
│   │   │   │   ├── campaign-list.tsx
│   │   │   │   ├── campaign-form.tsx
│   │   │   │   └── create-campaign-button.tsx
│   │   │   ├── data.ts       # Server-only data fetching
│   │   │   ├── page.tsx      # Server Component entry point
│   │   │   ├── loading.tsx   # Streaming skeleton
│   │   │   └── error.tsx     # Error boundary
│   │   └── publisher/        # Same structure as sponsor
│   ├── login/
│   ├── marketplace/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── api.ts                # Client-side API (credentials: 'include')
│   ├── server-api.ts         # Server-side API (cookie forwarding)
│   ├── auth-helpers.ts       # Server-only auth utilities
│   ├── types.ts              # Shared TypeScript types
│   ├── action-types.ts       # ActionState interface for server actions
│   └── utils.ts              # Generic utility functions
├── auth.ts                   # Better Auth server config
└── auth-client.ts            # Better Auth client instance
```

### File Size Limits

**Hard rule: no file over 300 lines.** If a file approaches this, split by concern.

**Practical thresholds:**

| File type | Target | Split when |
|-----------|--------|-----------|
| Components | ~50–120 lines | Multiple unrelated sections, inline sub-components |
| Server Actions | ~40–80 lines | Complex validation that could be extracted |
| Data files | ~15–30 lines | Multiple unrelated fetches |
| Type files | ~80–100 lines | Multiple domains mixed together |
| Utility files | ~50–100 lines | Mixed concerns (formatting + validation + parsing) |

**How to split components:**
- Extract sub-components into sibling files (`campaign-card.tsx` → `campaign-card.tsx` + `campaign-card-actions.tsx`)
- Extract hooks into `use-*.ts` files next to the component
- Extract constants/config into a sibling file (`status-colors.ts`)
- Move shared logic into `lib/` utilities

### Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | `kebab-case.ts` / `.tsx` | `campaign-card.tsx`, `submit-button.tsx` |
| Components | `PascalCase` function | `CampaignCard`, `SubmitButton` |
| Hooks | `useCamelCase` | `useFormReset`, `useModalState` |
| Server Actions | `camelCaseAction` | `createCampaignAction`, `deleteCampaignAction` |
| Types/Interfaces | `PascalCase` | `Campaign`, `ActionState`, `CampaignCardProps` |
| Constants | `camelCase` or `UPPER_SNAKE_CASE` | `statusColors`, `AD_SLOT_TYPES` |
| Data functions | `getCamelCase` | `getSponsorCampaigns`, `getPublisherAdSlots` |
| Action files | `verb-noun.ts` | `create-campaign.ts`, `delete-ad-slot.ts` |

### Import Conventions

**Import order** (separate groups with blank lines):

```ts
// 1. React / Next.js
import { useActionState } from 'react';
import { revalidatePath } from 'next/cache';

// 2. Third-party
import { authClient } from '@/auth-client';

// 3. Project aliases (@/)
import { serverApi } from '@/lib/server-api';
import type { Campaign } from '@/lib/types';

// 4. Relative imports
import { CampaignCard } from './campaign-card';
```

**Rules:**
- Use `@/` path alias for all non-relative imports (configured in `tsconfig.json`)
- Use `import type` for type-only imports — helps tree-shaking
- No barrel files (`index.ts`) for components — import directly from the file
- No circular imports between features

---

## Component Patterns

### Component Declaration

Always use **named function declarations** with **named exports**:

```ts
// Good
interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return <div>...</div>;
}

// Bad — arrow function
export const CampaignCard = ({ campaign }: CampaignCardProps) => { ... };

// Bad — default export
export default function CampaignCard() { ... }
```

**Exception:** Next.js conventions require default exports for `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx`.

### Props Typing

```ts
// Good — interface with Props suffix
interface CampaignFormProps {
  campaign?: Campaign;
  onClose: () => void;
}

// Bad — inline type
export function CampaignForm({ campaign, onClose }: { campaign?: Campaign; onClose: () => void }) { ... }

// Bad — generic 'Props' name (ambiguous in multi-component files)
interface Props { ... }
```

### Composability Over Configuration

Prefer composing small components over large components with many props:

```ts
// Good — small, composable
<FormModal open={open} onClose={handleClose} title="Create Campaign">
  <CampaignForm onClose={handleClose} />
</FormModal>

// Bad — one mega component doing everything
<CampaignModal mode="create" open={open} onClose={handleClose} onSubmit={handleSubmit}
  fields={['name', 'budget', 'dates']} validation={schema} ... />
```

---

## Custom Hooks

### When to Extract a Hook

Extract a custom hook when:
1. **Two or more components** share the same stateful logic
2. A component's **hook logic exceeds ~15 lines** and obscures the render
3. You need to **test stateful logic independently** from the UI

Do NOT extract a hook for:
- A single `useState` call — just use it inline
- Logic that only one component will ever use and is under 15 lines
- Wrapping a single library call with no added logic

### Hook File Naming and Location

```
# Co-located with consumer (feature-specific)
app/dashboard/sponsor/components/use-modal-state.ts

# Shared across features
lib/hooks/use-debounce.ts
lib/hooks/use-media-query.ts
```

### Hook Pattern

```ts
// lib/hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**Rules:**
- Hooks are always named `use*` (React convention, not optional)
- One hook per file unless they're tightly coupled
- Hooks must be pure — no side effects outside of `useEffect`
- Return a single value, a tuple `[value, setter]`, or an object `{ value, isLoading, error }`
- Document the hook's purpose with a single-line comment if the name isn't self-explanatory

---

## Server Actions

### Pattern

```ts
// app/dashboard/sponsor/actions/create-campaign.ts
'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';

export async function createCampaignAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Extract and validate fields
  const name = formData.get('name') as string;
  if (!name?.trim()) {
    return { success: false, fieldErrors: { name: 'Name is required' } };
  }

  // 2. Build payload
  const data = { name: name.trim(), /* ... */ };

  // 3. Call backend (forward cookies)
  try {
    const requestHeaders = await headers();
    await serverApi('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      requestHeaders,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }

  // 4. Revalidate and return success
  revalidatePath('/dashboard/sponsor');
  return { success: true };
}
```

### Rules

- **`'use server'` at file top**, not inline in functions
- **One action per file** — keeps each file focused and under the line limit
- **Never throw** — always return `ActionState`. The form component reads the returned state
- **Always `revalidatePath()`** after successful mutations
- **Forward request headers** to `serverApi` for auth cookie passthrough
- **Validate on the client side** (basic checks like required fields) for fast feedback, and on the server side (via backend API) for security
- **Use `headers()` from `next/headers`**, not `cookies()` — `serverApi` extracts cookies from the headers object automatically

### ActionState Shape

```ts
// lib/action-types.ts
export interface ActionState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export const initialActionState: ActionState = { success: false };
```

---

## Forms

### useActionState Pattern (React 19)

```tsx
'use client';

import { useActionState, useEffect } from 'react';
import { createCampaignAction } from '../actions/create-campaign';
import { initialActionState } from '@/lib/action-types';
import { SubmitButton } from '@/app/components/submit-button';

export function CampaignForm({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useActionState(createCampaignAction, initialActionState);

  // Close modal on success
  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction}>
      {state.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <label htmlFor="name">Name</label>
      <input id="name" name="name" required />
      {state.fieldErrors?.name && (
        <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
      )}

      <SubmitButton label="Create" pendingLabel="Creating..." />
    </form>
  );
}
```

### SubmitButton with useFormStatus

```tsx
'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label: string;
  pendingLabel: string;
  variant?: 'primary' | 'danger';
}

export function SubmitButton({ label, pendingLabel, variant = 'primary' }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}
```

### Important: `useActionState` is NOT `useFormState`

React 19 renamed `useFormState` → `useActionState` and moved it from `react-dom` to `react`:

```ts
// Correct (React 19.2.3)
import { useActionState } from 'react';

// Wrong (deprecated)
import { useFormState } from 'react-dom';
```

---

## Styling

### Tailwind CSS v4 (CSS-First)

This project uses **Tailwind CSS v4** with the CSS-first configuration approach. There is no `tailwind.config.js` — configuration happens in `globals.css` via `@theme`.

### CSS Variables

Theme colors are defined as CSS custom properties in `globals.css`:

```css
:root {
  --color-primary: ...;
  --color-secondary: ...;
  --color-background: ...;
  --color-foreground: ...;
  --color-muted: ...;
  --color-border: ...;
  --color-success: ...;
  --color-warning: ...;
  --color-error: ...;
}
```

**Always use CSS variables** for theme colors, not raw Tailwind colors:

```tsx
// Good
<div className="border-[--color-border] text-[--color-muted]">

// Bad — hardcoded colors break theming
<div className="border-gray-200 text-gray-500">
```

**Exception:** Status/type badge colors (`bg-green-100 text-green-700`) are acceptable for semantic one-off styling that doesn't need theming.

### Styling Rules

- Use Tailwind utility classes exclusively — no CSS modules, no inline styles (except dynamic values like `style={{ width }}`)
- Keep class lists readable — break long class strings across lines if needed
- Use `className` for static styles, `style` only for truly dynamic computed values
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Animation: use Tailwind's `animate-pulse` for skeletons, `transition-*` for interactions

---

## Data Fetching

### Server-Side (Reads)

```ts
// app/dashboard/sponsor/data.ts
import 'server-only';

import type { Campaign } from '@/lib/types';
import { serverApi, type ForwardedRequestHeaders } from '@/lib/server-api';

export async function getSponsorCampaigns(
  requestHeaders?: ForwardedRequestHeaders
): Promise<Campaign[]> {
  return serverApi<Campaign[]>('/api/campaigns', {
    cache: 'no-store',
    requestHeaders,
  });
}
```

**Rules:**
- Always `import 'server-only'` in data files — prevents accidental client bundling
- Always pass `requestHeaders` for auth cookie forwarding
- Use `cache: 'no-store'` for user-specific data (dashboards)
- One file per feature, co-located with `page.tsx`
- Functions return typed data, not Response objects

### Client-Side API (Legacy)

`lib/api.ts` exists for client-side fetching with `credentials: 'include'`. **Avoid using it for new code.** Prefer server-side fetching via `data.ts` + server components. The only valid use case is real-time data that must update without a page transition (e.g., live notifications).

---

## Auth

### Server-Side Auth Check (Pages)

```ts
// In page.tsx
const requestHeaders = await headers();
const session = await auth.api.getSession({ headers: requestHeaders });
if (!session?.user) redirect('/login');

const roleData = await getCurrentUserProfile(requestHeaders);
if (roleData.role !== 'sponsor') redirect('/');
```

### Client-Side Session

```ts
// In 'use client' components
import { authClient } from '@/auth-client';
const { data: session } = authClient.useSession();
```

### Server Action Auth

```ts
// In 'use server' actions — forward request headers for cookie passthrough
const requestHeaders = await headers();
await serverApi('/api/endpoint', { requestHeaders, /* ... */ });
```

**Never expose session tokens, user IDs, or role information in client-rendered HTML** unless it's needed for display. Auth decisions happen server-side.

---

## Error Handling

### Error Boundaries (`error.tsx`)

Every feature directory should have an `error.tsx`:

```tsx
'use client';

export default function FeatureError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Loading Boundaries (`loading.tsx`)

Every feature directory should have a `loading.tsx` with skeleton UI:

```tsx
export default function FeatureLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-[--color-border] p-4">
          <div className="h-5 w-2/3 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-full rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
```

### In Server Actions

Actions never throw. Catch errors, return structured `ActionState`:

```ts
try {
  await serverApi('/api/resource', { ... });
} catch (error) {
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Something went wrong',
  };
}
```

### In Components

Display errors from `ActionState` in forms. Use error boundaries for unexpected crashes. Don't wrap every render in try/catch.

---

## Types

### Location

All shared types live in `lib/types.ts`. This includes entities (`Campaign`, `AdSlot`), enums (`CampaignStatus`, `AdSlotType`), and input types (`CreateCampaignInput`).

**Rules:**
- If `lib/types.ts` exceeds ~150 lines, split by domain: `lib/types/campaign.ts`, `lib/types/ad-slot.ts`, etc.
- Types used by only one component can be co-located (interface in the same file)
- Props interfaces always live in the component file, never in `lib/types.ts`
- Use `type` for unions/aliases, `interface` for object shapes (consistency with existing code)
- Import with `import type` when only the type is needed

### Decimal Handling

Backend returns Prisma `Decimal` fields as strings. Frontend types use `DecimalValue = number | string`. Always convert to `Number()` before display:

```ts
const budget = Number(campaign.budget);
```

---

## Don'ts

- **Don't** fetch data in `useEffect` — use server components + `data.ts` files
- **Don't** add `'use client'` to a whole page — push the boundary down to the interactive leaf
- **Don't** use `useFormState` — it's deprecated in React 19. Use `useActionState` from `'react'`
- **Don't** throw inside server actions — return `ActionState` with error details
- **Don't** hardcode colors — use CSS variables (`--color-*`) for theme consistency
- **Don't** use default exports (except Next.js `page/layout/loading/error/not-found.tsx`)
- **Don't** create catch-all files (`common.tsx`, `shared.tsx`, `helpers.tsx`)
- **Don't** add comments that restate what the code does
- **Don't** install new dependencies without justification — check if native APIs or existing deps cover the need
- **Don't** use `any` type — use `unknown` and narrow, or define a proper type
- **Don't** put business logic in components — extract to server actions or lib utilities
- **Don't** mix concerns in one file (fetching + rendering + validation + formatting)
- **Don't** create wrapper components that just pass props through with no added value
- **Don't** use inline styles for things Tailwind can handle
- **Don't** forget `loading.tsx` and `error.tsx` for new route segments

## Do's

- **Do** use `import 'server-only'` in all data fetching files
- **Do** use `import type` for type-only imports
- **Do** forward `requestHeaders` when calling `serverApi` (auth cookie passthrough)
- **Do** use `revalidatePath()` after every successful mutation
- **Do** use CSS variables (`--color-primary`, `--color-border`, etc.) for themed styles
- **Do** add `loading.tsx` and `error.tsx` for every route segment with async data
- **Do** push `'use client'` boundaries as deep into the component tree as possible
- **Do** use named exports and named function declarations for components
- **Do** co-locate components, actions, and data files with their feature
- **Do** split files proactively when approaching 300 lines
- **Do** use `htmlFor` on `<label>` elements and `id` on inputs for accessibility
- **Do** type all props with interfaces — never use `any` or untyped props
- **Do** handle empty states in list components ("No items yet. Create your first...")
- **Do** use `key` prop on all mapped elements — prefer stable IDs over array indices

---

## Reference: Key Files

| File | Purpose |
|------|---------|
| `auth.ts` | Better Auth server config (used in server components) |
| `auth-client.ts` | Better Auth client instance (used in `'use client'` components) |
| `lib/server-api.ts` | Server-side API client with cookie forwarding |
| `lib/api.ts` | Client-side API client (legacy — prefer server-side) |
| `lib/auth-helpers.ts` | `getCurrentUserProfile()` for role checks |
| `lib/types.ts` | Shared TypeScript types (Campaign, AdSlot, etc.) |
| `lib/action-types.ts` | `ActionState` interface for server actions |
| `app/components/nav.tsx` | Shared navigation component |
| `app/components/submit-button.tsx` | Shared form submit button with `useFormStatus` |
| `app/components/form-modal.tsx` | Shared modal dialog wrapper |
| `app/globals.css` | CSS variables + Tailwind v4 theme |

---

## Avoiding Monoliths — Decision Checklist

Before adding code to an existing file, ask:

1. **Does this belong to the same feature?** If not, it goes in a different directory.
2. **Will the file exceed 300 lines after this change?** If yes, split first.
3. **Am I mixing concerns?** Data fetching + rendering + validation in one file = split.
4. **Is this stateful logic reusable?** Extract a custom hook.
5. **Is this a new UI section?** New section = new component file.
6. **Am I adding a type only used here?** Co-locate it, don't add to `lib/types.ts`.
7. **Am I adding a utility?** Generic → `lib/utils.ts` or `lib/hooks/`. Domain-specific → next to consumer.
