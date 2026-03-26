# Marketplace List Refactor and Virtualization Plan

## Objective

Refactor the Marketplace B grid into smaller, maintainable units and add production-grade virtualization so the page remains fast as `adSlots` grows significantly.

This plan assumes:

- No feature regressions.
- Existing analytics behavior stays intact.
- Existing visual direction stays intact unless explicitly improved.
- The filter UX is upgraded, especially for Budget and Estimated CPM.

## Current Problems

- `marketplace-grid-b.tsx` mixes layout composition, filter state, filter logic, and section splitting.
- `marketplace-filter-bar.tsx` is a controlled mega-component with too many props.
- Budget and CPM use hardcoded enum buckets instead of numeric ranges.
- Filtering recalculates derived values repeatedly.
- The current grid renders the full result set, which will degrade badly with larger inventories.
- The current file sizes already violate or strain the frontend guidance for focused files.

## Recommended Technical Direction

### 1. Move to a filter domain model

Replace many primitive props with one typed filter state object.

```ts
type NumericRange = {
  min: number | null;
  max: number | null;
};

type MarketplaceFilters = {
  query: string;
  type: AdSlotType | 'ALL';
  availability: 'available' | 'all';
  verifiedOnly: boolean;
  price: NumericRange;
  estimatedCpm: NumericRange;
  sort: 'price-desc' | 'price-asc' | 'reach';
};
```

This keeps the interface stable as the filter UI evolves and eliminates the current prop explosion.

### 2. Normalize slot data once

Create a pure normalization layer that derives values once per dataset:

- `price`
- `audienceSize`
- `estimatedCpm`
- `isVerified`
- `reach`
- `searchIndex`

This removes repeated `Number(...)`, repeated CPM calculation, and repeated string normalization inside every filter pass.

### 3. Use a reusable filter engine

Move filtering and sorting into pure functions:

- `normalizeMarketplaceSlots`
- `applyMarketplaceFilters`
- `sortMarketplaceSlots`
- `splitMarketplaceSections`
- `getMarketplaceFilterBounds`

These functions should live outside React and be covered by unit tests.

### 4. Use row virtualization with TanStack Virtual

Recommended library: `@tanstack/react-virtual`

Why this is the best fit:

- It matches the TanStack stack already used in the repo.
- It is lighter and cleaner than building custom scroll math.
- It supports dynamic measurement.
- It works well with React 19 and modern client components.
- It lets us keep native page scroll instead of introducing a nested scrolling region.

Recommended strategy:

- Virtualize rows, not individual cards.
- Keep the existing responsive multi-column layout.
- Convert the filtered slot arrays into virtual rows based on the current column count.
- Use one virtualized result stream for the full results area so section headers and rows stay in one scroll model.

This is cleaner than:

- rendering every card
- building a custom virtualization hook
- forcing a fixed-height scroll container
- trying to virtualize a CSS grid item-by-item

## Budget and Estimated CPM UX

### Recommended behavior

- Replace bucket enums with numeric range filters.
- Use a slider plus numeric min/max inputs.
- Make `max` open-ended by default with `null` meaning `No max`.
- Derive visible slider bounds from the dataset, not hardcoded constants.
- Keep bounds stable from the full dataset so they do not jump as other filters change.
- Show formatted helper text such as `$2,500 to No max`.

### Gold-standard handling for high-end values

Do not hard-cap to a fake visible maximum.

Instead:

- derive the upper bound from the current dataset
- keep `max = null` as a valid open-ended state
- map slider movement on a logarithmic scale under the hood if value distribution is skewed

This solves the problem where a linear slider makes high values unreachable or forces a misleading maximum.

### Estimated CPM edge case

Some slots may not have enough data to calculate CPM.

Recommended behavior:

- default CPM filtering excludes only when the user applies a CPM range
- expose helper copy such as `12 listings have no CPM estimate`
- optionally include a later enhancement: `Include unknown CPM`

## Virtualization Architecture

### Recommendation

Use `@tanstack/react-virtual` with `useWindowVirtualizer`.

Reason:

- the page already scrolls at the window level
- the marketplace has a hero/filter area above the list
- nested scroll containers would make UX and accessibility worse

### Virtual row model

Build a flattened array of virtual blocks:

```ts
type MarketplaceVirtualBlock =
  | { kind: 'section-header'; id: string; title: string; description: string }
  | { kind: 'card-row'; id: string; slots: NormalizedMarketplaceSlot[] };
```

How it works:

- determine column count from container width and the existing breakpoints
- chunk section items into rows
- insert section-header blocks before each section
- virtualize the full block list

This preserves:

- Available placements section
- Booked section
- current grouping semantics
- future extensibility for extra section blocks

### Dynamic columns

Create a small responsive hook such as `use-marketplace-grid-columns.ts` that maps width to the current layout:

- `< md`: 1 column
- `md to xl`: 2 columns
- `xl+`: 3 columns

Use `ResizeObserver` on the grid container instead of `window.innerWidth` so the virtualization logic follows the actual available width.

### Dynamic height measurement

Use `measureElement` for row blocks.

Why:

- card height can vary slightly due to missing description, metrics, or publisher metadata
- row height should be measured, not guessed
- measured rows reduce overlap and scroll jump bugs

### Overscan

Use a moderate overscan, for example 4 to 6 rows.

This keeps scrolling smooth without exploding DOM node count.

### Activation threshold

Do not virtualize tiny datasets.

Recommended threshold:

- if total rendered cards is below roughly 24 to 30, render normally
- once above the threshold, switch to virtualized rows

This avoids unnecessary complexity and measurement overhead for small inventories.

## Proposed File Structure

```txt
apps/frontend/app/(protected)/marketplace/components-b/
  marketplace-grid-b.tsx
  marketplace-results-b.tsx
  marketplace-results-empty-state-b.tsx
  marketplace-sections-b.tsx
  marketplace-filters-panel.tsx
  marketplace-chip-group.tsx
  marketplace-range-filter.tsx
  marketplace-toggle-chip.tsx
  use-marketplace-filters.ts
  use-marketplace-grid-columns.ts
  use-marketplace-virtual-rows.ts
  marketplace-filter.types.ts
  marketplace-filter.constants.ts
  marketplace-filter.utils.ts
  marketplace-virtual.types.ts
```

## Task Breakdown

### Phase 1. Filter engine extraction

- Create `marketplace-filter.types.ts` for filter and range types.
- Create `marketplace-filter.constants.ts` for defaults and static options.
- Create `marketplace-filter.utils.ts` for normalization, filtering, sorting, and bounds.
- Add unit tests for the pure filter utilities.

### Phase 2. State ownership cleanup

- Create `use-marketplace-filters.ts`.
- Move `advancedFiltersOpen`, filter state, reset actions, derived counts, and filtered results into that hook.
- Keep `marketplace-grid-b.tsx` as a composition layer only.

### Phase 3. Filter UI decomposition

- Split `marketplace-filter-bar.tsx` into smaller components.
- Replace primitive prop lists with `filters` and `actions` objects.
- Keep the panel accessible and keyboard friendly.

### Phase 4. Budget and CPM range controls

- Build `marketplace-range-filter.tsx`.
- Support slider interaction and numeric input interaction.
- Represent open-ended maximum cleanly.
- Add formatting helpers for labels and input parsing.
- Keep CPM filtering aware of `null` estimates.

### Phase 5. Virtualization

- Add `@tanstack/react-virtual`.
- Create `use-marketplace-grid-columns.ts`.
- Create `use-marketplace-virtual-rows.ts`.
- Build a flattened virtual block model for section headers and rows.
- Render rows with measured heights and stable keys.
- Preserve the existing available/booked grouping.

### Phase 6. Performance safeguards

- Use `useDeferredValue` for the search query.
- Memoize normalized slots from `adSlots`.
- Memoize filtered results from normalized slots and deferred query.
- Memoize virtual blocks from filtered sections and column count.
- Avoid inline recreation of large option arrays inside render.

### Phase 7. Verification

- Add unit tests for filter logic.
- Add unit tests for range parsing and open-ended bounds.
- Add unit tests for row chunking and virtual block generation.
- Add component tests for the filter panel interactions.
- Manually verify scrolling, resize behavior, keyboard navigation, and no hidden results at high price/CPM values.

## Library Decision

### Recommended

Install:

```txt
@tanstack/react-virtual
```

### Not recommended as primary solutions

- Custom virtualization logic with manual scroll math
- `react-window` for this case
- Per-card absolute positioning in a responsive CSS grid
- A fixed-height internal scroll container

### Why not custom virtualization

- higher bug surface
- more layout math to maintain
- harder to test correctly
- no upside over TanStack Virtual in this codebase

## Acceptance Criteria

- Filter logic is fully extracted from the page composition file.
- No marketplace component file exceeds the repo size guideline.
- Budget and CPM filters use numeric ranges, not enum buckets.
- The range UI never hides the top end of the dataset behind a misleading max.
- Search, sort, availability, verification, budget, and CPM filters preserve current behavior unless intentionally improved.
- The page keeps current analytics behavior.
- The DOM node count stays bounded when inventory grows.
- Scroll remains smooth on large datasets.
- Resize between breakpoints does not corrupt layout or scroll position.
- No nested scroll trap is introduced.

## Risks and Mitigations

### Risk: virtualization bugs with responsive grid changes

Mitigation:

- virtualize rows, not cards
- derive columns from container width
- measure row elements

### Risk: scroll jump from inaccurate estimates

Mitigation:

- provide conservative `estimateSize`
- enable `measureElement`
- keep row wrappers stable

### Risk: behavior drift during refactor

Mitigation:

- land filter engine extraction first
- add tests before replacing the UI
- preserve current section semantics and card rendering

### Risk: CPM filtering confusion for slots with missing audience data

Mitigation:

- make missing CPM explicit in the UI
- cover that behavior with tests

## Recommended Implementation Order

1. Extract filter types, defaults, utils, and tests.
2. Add `use-marketplace-filters.ts` and keep the current UI temporarily.
3. Split the filter panel into smaller components.
4. Replace budget and CPM buckets with range controls.
5. Add row virtualization using `@tanstack/react-virtual`.
6. Verify parity, performance, and resize behavior.

## Final Recommendation

Yes, this can be done with a clean, senior-level implementation.

The gold-standard path is:

- typed filter domain model
- pure normalization and filter engine
- decomposed UI
- numeric range filters with open-ended max handling
- `@tanstack/react-virtual` row virtualization over the full results stream

That is the most maintainable path with the lowest long-term bug surface for this marketplace page.

## Implementation Adjustments

- Organize `components-b` into feature subfolders such as `filters/`, `results/`, and `cards/` instead of keeping a flat file list.
- Keep the full filter model client-side for now, but initialize it from server `searchParams` and synchronize it back to the URL with `history.replaceState` so the page does not re-fetch on every local filter change.
- Treat virtualization and infinite scroll as separate concerns.
- The current virtualization layer should optimize rendering for already-loaded data.
- True infinite loading should be a follow-up phase only after the backend exposes paginated marketplace queries and the UI can show a real loading row, end-of-list state, and error recovery.
