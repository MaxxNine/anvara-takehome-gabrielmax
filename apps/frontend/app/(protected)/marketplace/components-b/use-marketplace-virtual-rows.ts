'use client';

import { useMemo } from 'react';

import { useWindowVirtualizer } from '@tanstack/react-virtual';

import type { AdSlot } from '@/lib/types';

export type MarketplaceSlotRow = {
  id: string;
  slots: AdSlot[];
};

type UseMarketplaceVirtualRowsOptions = {
  columns: number;
  enabled: boolean;
  scrollMargin: number;
  slots: AdSlot[];
};

function getEstimatedRowHeight(columns: number): number {
  if (columns === 1) {
    return 380;
  }

  return 335;
}

export function buildMarketplaceSlotRows(
  slots: AdSlot[],
  columns: number
): MarketplaceSlotRow[] {
  const rows: MarketplaceSlotRow[] = [];

  for (let index = 0; index < slots.length; index += columns) {
    const rowSlots = slots.slice(index, index + columns);

    rows.push({
      id: rowSlots.map((slot) => slot.id).join(':'),
      slots: rowSlots,
    });
  }

  return rows;
}

export function useMarketplaceVirtualRows({
  columns,
  enabled,
  scrollMargin,
  slots,
}: UseMarketplaceVirtualRowsOptions) {
  const rows = useMemo(() => buildMarketplaceSlotRows(slots, columns), [columns, slots]);

  const virtualizer = useWindowVirtualizer<HTMLDivElement>({
    count: rows.length,
    enabled,
    estimateSize: () => getEstimatedRowHeight(columns),
    gap: 20,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: 4,
    scrollMargin,
  });

  return {
    rows,
    virtualizer,
  };
}
