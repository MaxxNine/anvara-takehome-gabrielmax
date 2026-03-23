# Task 01: Pin Better Auth CLI

## Goal

Keep the existing TypeScript setup flow, but remove the unpinned Better Auth CLI download from the database migration step.

## Why this change exists

The original setup script executed the Better Auth migration with:

- `npx @better-auth/cli migrate --yes`

That meant the CLI was resolved at runtime instead of through the workspace lockfile. Even if the package itself is legitimate, this is weaker than running a pinned local dependency.

## Scope

- Add `@better-auth/cli` as a pinned dev dependency in the frontend workspace
- Replace the migration step with `pnpm --filter @anvara/frontend exec better-auth migrate --yes`
- Keep `scripts/setup.ts`, `scripts/reset.ts`, and the `pnpm dlx tsx` entrypoints unchanged
- Add a small validation step for the database name before interpolating it into shell commands

## Expected outcome

- Better Auth migrations run through a lockfile-backed dependency
- The setup flow stays familiar for the candidate
- The only behavioral change is tighter control over the auth CLI execution path and a small input-safety guard
