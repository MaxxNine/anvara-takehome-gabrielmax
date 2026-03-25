# Marketplace Visibility for Sponsors

## Decision

**Option B: Show all ad slots to sponsors, with availability indicators.**

Sponsors see the full catalog of ad slots from all publishers, regardless of booking status. Booked slots display a "Booked" badge and have their booking CTA disabled. Available slots display an "Available" badge and can be booked normally.

---

## Context

The marketplace is a two-sided platform:
- **Publishers** create ad slots (inventory)
- **Sponsors** browse and book ad slots

The original implementation filtered the marketplace API to only return `isAvailable: true` slots for sponsors. This meant booked inventory was completely hidden.

### The Problem

During normal usage, sponsors would book ad slots. Once all slots from a publisher were booked, that publisher's inventory disappeared entirely from the marketplace. A sponsor visiting the marketplace for the first time would have no way to know:
- What types of inventory exist on the platform
- Which publishers are part of the network
- Whether inventory is temporarily unavailable vs. non-existent

This was surfaced when testing the booking flow caused the marketplace to appear completely empty.

---

## Options Considered

### Option A: Available only (original)

- Sponsors only see slots with `isAvailable: true`
- Cleaner, shorter list — no noise
- **Downside**: Zero visibility into booked inventory. Empty marketplace when all slots are booked. No way to gauge platform inventory or demand.

### Option B: Full catalog with status indicators (chosen)

- Sponsors see all ad slots regardless of availability
- Booked slots show a "Booked" badge with a muted/disabled card style
- Available slots show an "Available" badge and remain fully interactive
- **Upside**: Sponsors understand the full scope of the platform. Social proof (booked = demand). Foundation for future "notify me" feature.
- **Downside**: Slightly noisier list. Sponsors may click a booked slot only to find they can't book it.

---

## Implementation

### Backend Change

**File**: `apps/backend/src/routes/ad-slots/query-routes.ts`

Removed the `availableOnly` forced filter for sponsors. The API now returns all ad slots for sponsors (same as it does for non-publisher roles). The `available=true` query parameter still works for explicit filtering.

```diff
- availableOnly: req.user?.role === 'SPONSOR' || available === 'true',
+ availableOnly: available === 'true',
```

### Frontend Change

**File**: `apps/frontend/app/marketplace/components/ad-slot-card.tsx`

The card already had availability indicators (`Available` / `Booked` text with green/muted colors). Added visual distinction for booked slots:
- Reduced opacity on the card wrapper
- Disabled pointer cursor (no click-through to detail page)
- "Booked" badge styling

### No Changes Needed

- `ad-slot-grid.tsx` — Already renders all slots passed to it
- `marketplace/page.tsx` — Already passes all fetched slots to the grid
- `ad-slot.service.ts` — The `availableOnly` filter is conditional and already handles both cases
- Frontend types — `AdSlot.isAvailable` field already exists

---

## Future Considerations

- **"Notify me" feature**: With booked slots visible, a natural next step is letting sponsors opt into notifications when a specific slot becomes available again.
- **Filtering/sorting**: The marketplace could add an "Available only" toggle for sponsors who prefer the cleaner view.
- **Waitlist**: High-demand slots could support a waitlist queue.
