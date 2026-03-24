# Task 05: CRUD Operations (Challenge 04)

## Goal

Complete the missing backend CRUD operations for campaigns and ad slots, fix the broken ad-slot create path, and keep the backend aligned with the routing, service, and file-organization rules introduced during Challenge 03.

## What we changed

### Completed missing endpoints

Added the missing mutation endpoints required by Challenge 04:

- `PUT /api/campaigns/:id`
- `DELETE /api/campaigns/:id`
- `PUT /api/ad-slots/:id`
- `DELETE /api/ad-slots/:id`

The existing `POST /api/ad-slots` route was also fixed so it validates `basePrice > 0` and always uses the authenticated publisher from `req.user`, ignoring any `publisherId` in the request body.

### Route organization

To keep route files small and consistent with the backend guidelines, the route layer now uses resource folders:

```text
src/routes/
├── campaigns/
│   ├── index.ts
│   ├── query-routes.ts
│   └── mutation-routes.ts
└── ad-slots/
    ├── index.ts
    ├── query-routes.ts
    └── mutation-routes.ts
```

This keeps the public router entrypoint thin while separating read concerns from mutation concerns.

### Service organization

Campaign and ad-slot services were also moved to folder-based modules to match the `services/auth/` pattern:

```text
src/services/
├── campaign/
│   ├── index.ts
│   ├── campaign.service.ts
│   └── campaign.helpers.ts
└── ad-slot/
    ├── index.ts
    ├── ad-slot.service.ts
    └── ad-slot.helpers.ts
```

The service files own Prisma operations, while the helper files own request-shaping and validation logic for create/update inputs.

### Validation and input shaping

For campaigns:

- create and update payloads are normalized in `campaign.helpers.ts`
- `budget`, `cpmRate`, and `cpcRate` must be positive when provided
- `startDate` and `endDate` must be valid dates and `endDate` cannot be earlier than `startDate`
- status changes are validated against explicit allowed transitions

For ad slots:

- create and update payloads are normalized in `ad-slot.helpers.ts`
- `basePrice` must be positive
- `width` and `height` must be positive integers when provided
- `type` must be a valid `AdSlotType`

To avoid repeating domain-free parsing logic, shared validation helpers were extracted into `src/utils/validation.ts`.

### Ownership and authorization

Mutations are still strictly route-level authorization concerns:

- only sponsors can create, update, or delete campaigns
- only publishers can create, update, or delete ad slots
- campaign update/delete verifies the campaign belongs to `req.user.sponsorId`
- ad-slot update/delete verifies the slot belongs to `req.user.publisherId`
- ad-slot unbook is now restricted to the owning publisher instead of being open to any authenticated user

This keeps services auth-agnostic and aligned with the separation defined in `AGENTS_BE.md`.

## Scope and decisions

### What was implemented

- missing campaign update and delete endpoints
- missing ad-slot update and delete endpoints
- ad-slot create fix for `basePrice` validation and authenticated ownership
- route refactor into resource folders
- service refactor into folder-based modules
- shared validation extraction
- tighter `unbook` authorization

### Key design decisions

1. **Authorization stays in routes**  
   Ownership checks are performed before calling service mutations. Services remain reusable and unaware of HTTP/auth context.

2. **Folder names match resource paths**  
   `routes/ad-slots/` and `routes/campaigns/` are easier to navigate than mixed flat files like `adSlots.ts`.

3. **Shared parsing goes to `utils/validation.ts`**  
   The parsing helpers are domain-free and reused across service helpers, so they belong in a focused utility file instead of being duplicated.

4. **Status transitions are explicit**  
   Campaign status updates are constrained by a transition map instead of accepting any enum jump.

5. **No transactions were added**  
   Each Challenge 04 mutation affects a single primary table, so standalone Prisma mutations are sufficient here.

## Result

Verified outcomes after implementation:

- `PUT /api/campaigns/:id` returns `200` and persists campaign updates
- `DELETE /api/campaigns/:id` returns `204` and removes the campaign
- `PUT /api/ad-slots/:id` returns `200` and persists ad-slot updates
- `DELETE /api/ad-slots/:id` returns `204` and removes the ad slot
- `POST /api/ad-slots` returns `400` when `basePrice <= 0`
- `POST /api/ad-slots` uses the authenticated publisher, not body `publisherId`
- ownership violations return `403`
- non-existent resources return `404`
- invalid input returns `400`
- persistence was verified directly against PostgreSQL, which is the same data source Prisma Studio would display
- `pnpm --filter @anvara/backend typecheck` passes
- `pnpm --filter @anvara/backend lint` passes

Challenge 04 verification is also checked off in `BE-backlog/tasks.md`.
