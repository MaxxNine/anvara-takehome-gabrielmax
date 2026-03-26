import type { AdSlot } from '@/lib/types';

import { describe, expect, it } from 'vitest';

import { buildMarketplaceSlotRows } from './use-virtual-rows';

const slots = ['one', 'two', 'three', 'four', 'five'].map(
  (id): AdSlot => ({
    basePrice: 1000,
    id,
    isAvailable: true,
    name: id,
    publisherId: 'publisher',
    type: 'DISPLAY',
  })
);

describe('buildMarketplaceSlotRows', () => {
  it('chunks slots into responsive rows', () => {
    expect(buildMarketplaceSlotRows(slots, 2)).toEqual([
      { id: 'one:two', slots: [slots[0], slots[1]] },
      { id: 'three:four', slots: [slots[2], slots[3]] },
      { id: 'five', slots: [slots[4]] },
    ]);
  });
});
