# Task 01: Hardening Local Setup Execution

## Goal

Remove live package execution from the local setup path so the repo setup is reproducible and easier to trust on a real machine.

## Why this change exists

The original setup flow had two weak points:

- `pnpm setup-project` ran `pnpm dlx tsx scripts/setup.ts`
- `scripts/setup.ts` ran `npx @better-auth/cli migrate --yes`

Both commands can download and execute packages at runtime outside the repo lockfile. That is common in many projects, but it is a weaker trust model than running only pinned workspace dependencies.

## Scope

- Replace the TypeScript helper entrypoints with Node-run JavaScript files
- Keep the public command the same: `pnpm setup-project`
- Pin `@better-auth/cli` in the workspace and invoke it with `pnpm exec`
- Add a small safety check for the database name before interpolating it into shell commands

## Expected outcome

After this change:

- `pnpm setup-project` no longer depends on `pnpm dlx`
- Better Auth migrations run through a pinned workspace dependency
- The setup path is easier to audit because it stays inside repo-tracked tooling
