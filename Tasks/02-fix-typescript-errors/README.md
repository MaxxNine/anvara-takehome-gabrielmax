# Task 02: Fix TypeScript and Lint Errors

## Goal

Stabilize the workspace TypeScript and ESLint setup without adding features or changing product behavior.

## What we changed

- fixed backend `pnpm typecheck` failures by aligning route handlers with the Prisma schema and normalizing Express params before passing them to Prisma
- replaced the temporary local `cors` typing workaround with the real `@types/cors` dependency in the backend workspace
- corrected the shared ESLint configuration so `no-undef` is disabled for TypeScript files only, which removed false-positive editor and lint errors such as `process is not defined`
- cleaned backend lint issues by removing unused imports/bindings and replacing broad `any` usage in helper functions with concrete types
- cleaned frontend lint and typecheck issues by reusing shared DTOs in `apps/frontend/lib/types.ts`, typing the API client, removing `any` state in components, and fixing the `Nav` effect state flow
- added workspace VS Code ESLint settings so the editor resolves ESLint from the app workspaces and uses flat config correctly

## Scope and decisions

- no new features
- no schema changes made only to satisfy TypeScript or ESLint
- no compatibility shims for API shapes that are not present in the actual Prisma model
- no broad `eslint-disable` suppression for real problems
- warnings were left as warnings where that matched the current lint policy, especially `no-console`

## Result

Verified outcomes after the fixes:

- `pnpm --filter @anvara/backend typecheck` passes
- `pnpm --filter @anvara/backend lint` passes
- `pnpm --filter @anvara/frontend typecheck` passes
- `pnpm --filter @anvara/frontend lint` passes with warnings only
- root `pnpm typecheck` passes
- root `pnpm lint` passes

## Notes

The remaining frontend lint output is limited to existing `no-console` warnings. Those do not fail the build under the current ESLint policy.
