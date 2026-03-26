'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import type { AdSlot } from '@/lib/types';

import { AdSlotCardB } from './ad-slot-card-b';
import { useMarketplaceGridColumns } from './use-marketplace-grid-columns';
import { useMarketplaceVirtualRows } from './use-marketplace-virtual-rows';

type MarketplaceResultsBProps = {
  available: AdSlot[];
  booked: AdSlot[];
};

type MarketplaceResultSectionProps = {
  columns: number;
  description: string;
  emptyMessage: string;
  headingClassName?: string;
  sectionClassName?: string;
  slots: AdSlot[];
  title: string;
};

const virtualizationThreshold = 24;

function MarketplaceResultSection({
  columns,
  description,
  emptyMessage,
  headingClassName,
  sectionClassName,
  slots,
  title,
}: MarketplaceResultSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const shouldVirtualize = slots.length >= virtualizationThreshold;
  const { rows, virtualizer } = useMarketplaceVirtualRows({
    columns,
    enabled: shouldVirtualize,
    scrollMargin,
    slots,
  });

  useLayoutEffect(() => {
    const element = sectionRef.current;

    if (!element || typeof window === 'undefined') {
      return;
    }

    const nextMargin = element.getBoundingClientRect().top + window.scrollY;

    setScrollMargin((current) => (current === nextMargin ? current : nextMargin));
  }, [columns, shouldVirtualize, slots.length]);

  return (
    <section ref={sectionRef} className={sectionClassName ?? 'space-y-5'}>
      <div
        className={
          headingClassName ?? 'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'
        }
      >
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">{description}</p>
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/85 p-12 text-center text-slate-600">
          {emptyMessage}
        </div>
      ) : shouldVirtualize ? (
        <div
          className="relative"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <div className="grid gap-5 pb-5 md:grid-cols-2 xl:grid-cols-3">
                {rows[virtualRow.index]?.slots.map((slot) => (
                  <AdSlotCardB key={slot.id} slot={slot} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => (
            <AdSlotCardB key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </section>
  );
}

export function MarketplaceResultsB({ available, booked }: MarketplaceResultsBProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const columns = useMarketplaceGridColumns(containerRef);

  return (
    <div ref={containerRef} className="space-y-6">
      <MarketplaceResultSection
        columns={columns}
        title="Available placements"
        description={`Showing ${available.length} available placement${available.length === 1 ? '' : 's'} that match the current filters.`}
        emptyMessage={
          booked.length > 0
            ? 'No available placements match your filters. Matching booked placements are shown below.'
            : 'No placements match your filters. Try adjusting your search.'
        }
        slots={available}
      />

      {booked.length > 0 ? (
        <MarketplaceResultSection
          columns={columns}
          title="Currently booked"
          description={`${booked.length} placement${booked.length === 1 ? ' is' : 's are'} unavailable right now.`}
          sectionClassName="space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.22)]"
          slots={booked}
          emptyMessage="No booked placements match your filters."
        />
      ) : null}
    </div>
  );
}
