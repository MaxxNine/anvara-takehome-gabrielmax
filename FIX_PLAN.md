# `pnpm lint` Fix Plan

## Goal

Make `pnpm lint` pass across the workspace using senior-level maintenance decisions:

- fix real defects and code hygiene problems
- correct ESLint configuration only where it is objectively wrong for TypeScript
- avoid feature work, schema work, compatibility shims, and speculative refactors
- avoid silencing errors with `eslint-disable` unless there is no cleaner option

## Verified Current State

Commands run:

- `pnpm lint`
- `pnpm --filter @anvara/backend lint`
- `pnpm --filter @anvara/frontend lint`

Current failure surface:

- `apps/backend`: 11 errors, 1 warning
- `apps/frontend`: 43 errors, 4 warnings
- total: 54 errors, 5 warnings

## Root Causes

### 1. Shared ESLint config is misaligned with TypeScript

`no-undef` is producing false positives in TypeScript files for:

- `process`
- `RequestInit`
- `React` type references

This is configuration noise, not evidence that those files all need local code changes. In TypeScript, the compiler is the correct source of truth for undefined identifiers. The right fix is in the shared ESLint config, not scattered per-file workarounds.

Primary target:

- `packages/eslint-config/index.js`

Decision:

- disable core `no-undef` for `*.ts` and `*.tsx`
- keep the rule behavior from `@eslint/js` for plain JavaScript files
- do not add file-level globals, dummy imports, or per-file comments just to satisfy a misconfigured rule

### 2. There are real code-quality violations in backend utility/test files

Backend lint failures are mostly straightforward cleanup:

- unused import in `apps/backend/src/api.test.ts`
- unused catch parameter in `apps/backend/src/routes/health.ts`
- pervasive `any` usage and intentionally unused variables in `apps/backend/src/utils/helpers.ts`
- stale unused `eslint-disable` directive in `apps/backend/src/utils/helpers.ts`

Decision:

- keep backend changes minimal and mechanical
- replace `any` with concrete types or `unknown` plus narrowing where input is untrusted
- remove intentionally dead variables instead of suppressing rules

### 3. Frontend has a mix of config noise and real typing issues

Once `no-undef` is fixed in shared config, the remaining frontend failures are real:

- `any` usage in API helpers and utility helpers
- `any[]` state in list/grid components even though shared types already exist
- unused imports/locals
- debug `console.*` calls
- one real React Hooks rule violation in `app/components/nav.tsx`

Files already identified as primary cleanup targets:

- `apps/frontend/lib/api.ts`
- `apps/frontend/lib/utils.ts`
- `apps/frontend/lib/types.ts`
- `apps/frontend/app/components/nav.tsx`
- `apps/frontend/app/dashboard/publisher/components/ad-slot-list.tsx`
- `apps/frontend/app/dashboard/sponsor/components/campaign-list.tsx`
- `apps/frontend/app/marketplace/components/ad-slot-grid.tsx`
- `apps/frontend/app/page.tsx`
- `apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx`

## Remediation Order

### Phase 1. Fix the shared ESLint config first

Why first:

- it removes false positives before we touch application code
- it prevents repeating the earlier mistake of fixing symptoms instead of the actual source

Planned change:

- update `packages/eslint-config/index.js`
- add a TypeScript-specific override that turns off `no-undef` for `*.ts` and `*.tsx`

Validation:

- rerun `pnpm --filter @anvara/frontend lint`
- confirm the `process`, `RequestInit`, and `React` `no-undef` errors disappear

### Phase 2. Clean backend lint failures

Planned changes:

- `apps/backend/src/api.test.ts`
  - remove the unused `expect` import
- `apps/backend/src/routes/health.ts`
  - rename the unused catch binding to `_error` or remove the binding entirely
- `apps/backend/src/utils/helpers.ts`
  - replace `any` with concrete parameter and return types
  - use `unknown` only where the input is intentionally untrusted
  - remove deliberately unused locals
  - remove the stale `eslint-disable` directive

Decision constraints:

- no new helpers unless they are required to type existing behavior cleanly
- no behavior changes beyond what is needed to make existing helpers typed and lint-safe

Validation:

- rerun `pnpm --filter @anvara/backend lint`
- rerun `pnpm --filter @anvara/backend typecheck`

### Phase 3. Clean frontend typing failures by reusing existing types

Key point:

- `apps/frontend/lib/types.ts` already exists, so we should reuse and extend it rather than inventing parallel shapes in multiple components

Planned changes:

- `apps/frontend/lib/api.ts`
  - replace `any` return types with existing DTOs from `lib/types.ts`
  - add explicit request payload types where create helpers currently accept `any`
- `apps/frontend/app/dashboard/publisher/components/ad-slot-list.tsx`
  - replace `useState<any[]>` with `AdSlot[]`
- `apps/frontend/app/dashboard/sponsor/components/campaign-list.tsx`
  - replace `useState<any[]>` with `Campaign[]`
- `apps/frontend/app/marketplace/components/ad-slot-grid.tsx`
  - replace `useState<any[]>` with `AdSlot[]`
- `apps/frontend/lib/utils.ts`
  - convert broad `any` helpers to typed generics or concrete unions
  - remove unused locals
  - replace frontend `console.*` calls with existing logger usage or remove them when they are debug-only
- `apps/frontend/app/page.tsx`
  - remove the unused `Link` import

Decision constraints:

- do not create backend/frontend schema drift
- do not add feature behavior while typing these helpers
- prefer small DTO extensions in `lib/types.ts` over local inline types repeated in several files

### Phase 4. Fix the React Hooks violation in `Nav`

Problem:

- `app/components/nav.tsx` calls `setRole(null)` synchronously inside an effect when no user is present

Decision:

- fix the state model, not the lint rule
- avoid hacks such as delayed `setTimeout` resets or disabling `react-hooks/set-state-in-effect`

Planned approach:

- make role state safe for async fetching without synchronous effect resets
- tie resolved role data to the current user id so stale data cannot leak between sessions
- keep the component behavior the same from a user perspective

Validation:

- rerun `pnpm --filter @anvara/frontend lint`
- rerun `pnpm --filter @anvara/frontend typecheck`

### Phase 5. Final workspace verification

Final checks:

- `pnpm --filter @anvara/backend lint`
- `pnpm --filter @anvara/frontend lint`
- `pnpm lint`
- `pnpm typecheck`

## Guardrails

We should explicitly avoid these mistakes:

- no schema changes to satisfy lint
- no compatibility code for imaginary API shapes
- no new features disguised as cleanup
- no weakening of `@typescript-eslint/no-explicit-any`
- no broad `eslint-disable` comments to suppress real issues
- no package-by-package guessing without rerunning the root command

## Expected Outcome

After these phases:

- shared ESLint behavior is correct for TypeScript
- backend lint failures are reduced to straightforward hygiene fixes
- frontend lint failures are fixed with typed DTO usage and targeted hook cleanup
- `pnpm lint` passes without changing product behavior
