# Backend Agent Guidelines

Guidelines for agents implementing backend tasks. Read this before writing any code.

## Architecture

### Layer Separation

The backend follows a **three-layer** pattern:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Routes** | `src/routes/*.ts` | Parse HTTP input, check auth/ownership, call service, format HTTP response |
| **Services** | `src/services/*.ts` | Business logic, validation, Prisma queries |
| **Middleware** | `src/auth.ts`, `src/middleware/` | Cross-cutting: auth, error handling |

**Routes are thin.** They should NOT contain Prisma calls or business logic directly. They extract params/body, call a service function, and return the result with the correct status code.

**Services are pure logic.** They accept plain data (not `req`/`res`), return data or throw typed errors. They do NOT check authorization — that belongs in the route layer because it's an HTTP concern.

**Middleware is reusable.** `requireAuth` resolves the user once per request. `roleMiddleware` checks roles. The error handler catches thrown errors and maps them to HTTP responses.

### Types — Organized by Domain

Types live in `src/types/` and are split by domain, not dumped into one file:

```
src/types/
├── index.ts          # Re-exports everything (barrel file, no definitions here)
├── auth.ts           # AuthUser, AuthRequest
├── errors.ts         # NotFoundError, ValidationError, ForbiddenError
├── campaign.ts       # CreateCampaignInput, UpdateCampaignInput, CampaignFilters
└── ad-slot.ts        # CreateAdSlotInput, UpdateAdSlotInput, AdSlotFilters
```

**Rules:**
- Each file owns one domain's types. If a type is only used by one service, it lives next to that service's types — not in a shared catch-all.
- `index.ts` is a barrel — it re-exports from sibling files. Never put type definitions directly in the barrel.
- Prisma-generated types (enums, model types) come from `db.ts`. Don't redeclare them — import and extend if needed.
- When a type file grows past ~80 lines, split it further (e.g., `campaign-filters.ts`, `campaign-inputs.ts`).

---

## Code Patterns

### Route Handler Pattern

```ts
router.put('/:id', requireAuth, roleMiddleware(['SPONSOR']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Extract input
    const { id } = req.params;
    const data = req.body;

    // 2. Ownership check (route-level concern)
    const existing = await campaignService.getCampaignById(id);
    if (!existing) return res.status(404).json({ error: 'Campaign not found' });
    if (existing.sponsorId !== req.user!.sponsorId) return res.status(403).json({ error: 'Forbidden' });

    // 3. Call service
    const updated = await campaignService.updateCampaign(id, data);

    // 4. Return response
    res.json(updated);
  } catch (error) {
    next(error);
  }
});
```

### Service Function Pattern

```ts
export async function updateCampaign(id: string, data: UpdateCampaignInput) {
  // Validation (business rules)
  if (data.budget !== undefined && data.budget <= 0) {
    throw new ValidationError('Budget must be positive');
  }

  // Database operation
  return prisma.campaign.update({
    where: { id },
    data: { ...data },
    include: { sponsor: { select: { id: true, name: true } } },
  });
}
```

### Error Handling

- **Don't** wrap every line in try/catch inside services. Let errors propagate.
- **Do** use `next(error)` in route handlers to delegate to the error middleware.
- **Do** throw typed errors (`NotFoundError`, `ValidationError`, `ForbiddenError`) for expected failure cases.
- The centralized `error-handler.ts` middleware maps these to HTTP status codes.

---

## Auth Rules

### Middleware Order

Always: `requireAuth` first, then `roleMiddleware`, then the handler.

```ts
router.post('/', requireAuth, roleMiddleware(['SPONSOR']), handler);
```

### Ownership

- For mutations (POST/PUT/DELETE): **always verify ownership** in the route handler.
- Use `req.user!.sponsorId` or `req.user!.publisherId` — never trust the request body for identity.
- For POST (create): use `req.user!.sponsorId` as the foreign key, ignore any `sponsorId` in the body.
- For PUT/DELETE: fetch the resource first, compare its owner ID with `req.user`.

### Cross-Role Access

- GET list endpoints auto-scope by role: sponsors see their campaigns, publishers see their ad-slots.
- Cross-role browsing is allowed for reads: sponsors can browse ad-slots, publishers can browse campaigns.
- Mutations are always strictly scoped to the owner's role.

---

## HTTP Status Codes

| Code | When |
|------|------|
| 200 | Successful GET or PUT |
| 201 | Successful POST (resource created) |
| 204 | Successful DELETE (no body) |
| 400 | Invalid input / validation failure |
| 401 | No valid session (unauthenticated) |
| 403 | Authenticated but not authorized (wrong owner/role) |
| 404 | Resource not found |
| 500 | Unexpected server error |

For 403 vs 404 on ownership: return **404** when a resource doesn't exist OR when a user shouldn't know it exists. Return **403** only when the user can logically know the resource exists but shouldn't access it.

---

## Rate Limiting

Two rate limiters exist in `src/middleware/rate-limiter.ts`, both backed by Redis:

| Limiter | Scope | Window | Max Requests |
|---------|-------|--------|-------------|
| `globalLimiter` | All `/api` routes | 15 min | 100 per IP |
| `authLimiter` | `/api/auth` routes | 15 min | 10 per IP |

**Rules:**
- Rate limiters are mounted in `src/index.ts` before route handlers.
- The Redis client uses `REDIS_URL` from env. If Redis is unavailable, the limiter should fall back gracefully (log a warning, don't crash the server).
- Return `429 Too Many Requests` with a JSON body: `{ error: "Too many requests, please try again later" }`.
- Include `Retry-After` header in 429 responses.
- If adding a new sensitive endpoint (e.g., password reset), apply `authLimiter` or create a dedicated stricter limiter.

---

## File Organization & Scalability

### File Size Limits

- **Hard rule: no file over 150 lines.** If a file approaches this, split by concern — not arbitrarily.
- Route files: one file per resource (campaigns, ad-slots). If a resource grows complex (e.g., nested sub-routes), split into `campaigns/index.ts` + `campaigns/bulk.ts`.
- Service files: one file per resource. If a service needs internal helpers, extract them to a private helper file next to the service (e.g., `services/campaign.helpers.ts`), not into `utils/`.

### Utility & Helper Conventions

**`utils/` is for truly generic, domain-free utilities only.** Things like string formatting, date parsing, pagination math. If a helper is specific to a domain (e.g., campaign status transitions, ad-slot pricing logic), it belongs near its service:

```
# Good
src/services/campaign.service.ts
src/services/campaign.helpers.ts    ← domain-specific helpers

# Bad
src/utils/campaign-helpers.ts       ← domain logic leaking into utils
src/utils/helpers.ts                ← growing junk drawer
```

**Don't grow `utils/helpers.ts` further.** The existing file has mixed concerns (currency, pagination, email, dates). New generic utilities go in their own file under `utils/`:

```
src/utils/
├── params.ts         # getParam(), parsePagination()
├── format.ts         # formatCurrency(), formatDate()
├── validation.ts     # isValidEmail(), clampValue()
```

This split is not urgent for existing code, but **all new utilities must follow this pattern**.

### Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | `kebab-case.ts` | `ad-slot.service.ts`, `error-handler.ts` |
| Functions | `camelCase` | `getCampaignById`, `resolveUserRole` |
| Types/Interfaces | `PascalCase` | `AuthUser`, `CreateCampaignInput` |
| Error classes | `PascalCase` + `Error` suffix | `NotFoundError`, `ValidationError` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_PAGE_SIZE`, `DEFAULT_LIMIT` |
| Enums | Use Prisma-generated enums from `db.ts` | `CampaignStatus`, `AdSlotType` |

### Import Hygiene

- **No circular imports.** Services import from `db.ts` and `types/`. Routes import from services, auth, and `types/`. Never the reverse.
- **Barrel exports (`index.ts`) are for public API only.** Internal helpers should be imported directly, not re-exported through barrels.
- **Import order:** external packages → absolute project imports → relative imports. Separate groups with a blank line.
- **No default exports** except for Express routers (which is the Express convention). Everything else uses named exports for better refactoring support and explicit imports.

### Avoiding Monoliths — Decision Checklist

Before adding code to an existing file, ask:

1. **Does this belong to the same domain?** If not, it goes in a different file.
2. **Will the file exceed 150 lines after this change?** If yes, split first.
3. **Is this a new concern (validation, formatting, querying)?** New concern = new file, even if the domain is the same.
4. **Am I adding a type that's only used in one place?** Co-locate it with the consumer, don't add it to a shared types file.
5. **Am I tempted to add a `// --- section divider ---` comment?** That's a sign the file needs splitting.

---

## Don'ts

- **Don't** put Prisma calls directly in route handlers. Use service functions.
- **Don't** duplicate the role resolution logic. Use `resolveUserRole()` from `auth.service.ts`.
- **Don't** trust `req.body.sponsorId` or `req.body.publisherId` for identity. Always use `req.user`.
- **Don't** add `'use client'` or frontend-specific patterns in backend code.
- **Don't** over-validate. Trust Prisma types and schema constraints. Validate at the boundary (request input), not deep inside services.
- **Don't** add unnecessary abstractions. No repository layer — Prisma is the repository. No controller layer — routes are the controllers.
- **Don't** add comments that restate what the code does. Only comment non-obvious business rules.
- **Don't** grow existing files. If adding new logic would push a file past 150 lines, split it first.
- **Don't** put domain-specific helpers in `utils/`. They belong next to their service.
- **Don't** define types in barrel `index.ts` files. Barrels re-export only.
- **Don't** use default exports (except Express routers).
- **Don't** create catch-all files (`misc.ts`, `common.ts`, `shared.ts`). Name files by what they contain.

## Do's

- **Do** use the existing `getParam()` helper from `utils/helpers.ts` for extracting route params.
- **Do** use the existing Prisma types/enums from `db.ts` (e.g., `AdSlotType`, `CampaignStatus`).
- **Do** include relevant relations in Prisma queries (follow the patterns in existing GET handlers).
- **Do** use `next(error)` to delegate to the centralized error handler.
- **Do** keep route files focused on HTTP concerns and service files focused on data/logic.
- **Do** split types by domain (`types/campaign.ts`, `types/ad-slot.ts`), not one mega file.
- **Do** co-locate types that are only used in one place with their consumer.
- **Do** use named exports everywhere for refactoring safety.
- **Do** check file length before adding code. Split proactively, not reactively.

---

## Reference: Key Files

| File | Purpose |
|------|---------|
| `src/auth.ts` | Better Auth instance, `requireAuth`, `roleMiddleware` |
| `src/db.ts` | Prisma client singleton, re-exports types/enums |
| `src/types/` | Split by domain: `auth.ts`, `errors.ts`, `campaign.ts`, `ad-slot.ts`. Barrel `index.ts` re-exports. |
| `src/services/auth.service.ts` | `resolveUserRole()` |
| `src/services/campaign.service.ts` | Campaign CRUD logic |
| `src/services/ad-slot.service.ts` | Ad slot CRUD logic |
| `src/middleware/error-handler.ts` | Centralized Express error handler |
| `src/middleware/rate-limiter.ts` | Redis-backed rate limiting (global + auth-specific) |
| `src/utils/helpers.ts` | `getParam()`, `parsePagination()`, etc. |
| `apps/frontend/auth.ts` | Frontend Better Auth config (mirror for backend) |
| `apps/frontend/lib/server-api.ts` | Server-side API client (forwards cookies) |
