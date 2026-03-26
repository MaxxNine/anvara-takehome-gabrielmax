'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { AlertCircle } from 'lucide-react';

import { AdSlotCardB } from '../../cards/ad-slot-card';
import { useMarketplaceGridColumns } from '../model/use-grid-columns';
import type { MarketplaceSectionQueryState } from '../model/use-section-query';
import { useMarketplaceVirtualRows } from '../model/use-virtual-rows';
import { MarketplaceLoadMoreSentinel } from './load-more-sentinel';
import { MarketplaceLoadingRows } from './loading-rows';
import { MarketplaceResultsErrorState } from './results-error-state';

type MarketplaceResultsBProps = {
  available: MarketplaceSectionQueryState;
  booked: MarketplaceSectionQueryState;
  showBooked: boolean;
};

type MarketplaceResultSectionProps = {
  columns: number;
  emptyMessage: string;
  headingClassName?: string;
  incrementalErrorMessage: string;
  initialErrorMessage: string;
  section: MarketplaceSectionQueryState;
  sectionClassName?: string;
  title: string;
};

const virtualizationThreshold = 24;

function getDescription(title: string, loadedCount: number, totalCount: number): string {
  const noun = title === 'Available placements' ? 'available placement' : 'booked placement';
  const suffix = totalCount === 1 ? '' : 's';

  if (loadedCount < totalCount) {
    return `Showing ${loadedCount} of ${totalCount} ${noun}${suffix} that match the current filters.`;
  }

  return `Showing ${totalCount} ${noun}${suffix} that match the current filters.`;
}

function MarketplaceResultSection({
  columns,
  emptyMessage,
  headingClassName,
  incrementalErrorMessage,
  initialErrorMessage,
  section,
  sectionClassName,
  title,
}: MarketplaceResultSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const shouldVirtualize = section.items.length >= virtualizationThreshold;
  const { rows, virtualizer } = useMarketplaceVirtualRows({
    columns,
    enabled: shouldVirtualize,
    scrollMargin,
    slots: section.items,
  });

  useLayoutEffect(() => {
    const element = sectionRef.current;

    if (!element || typeof window === 'undefined') {
      return;
    }

    const nextMargin = element.getBoundingClientRect().top + window.scrollY;
    setScrollMargin((current) => (current === nextMargin ? current : nextMargin));
  }, [columns, shouldVirtualize, section.items.length]);

  const loadMore = () => {
    if (!section.hasNextPage || section.isFetchingNextPage) {
      return;
    }

    void section.fetchNextPage();
  };

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
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            {getDescription(title, section.items.length, section.totalCount)}
          </p>
        </div>
      </div>

      {section.isInitialLoading ? (
        <MarketplaceLoadingRows />
      ) : section.isInitialError ? (
        <MarketplaceResultsErrorState
          message={initialErrorMessage}
          onRetry={() => void section.refetch()}
        />
      ) : section.totalCount === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/85 p-12 text-center text-slate-600">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {shouldVirtualize ? (
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
              {section.items.map((slot) => (
                <AdSlotCardB key={slot.id} slot={slot} />
              ))}
            </div>
          )}

          {section.isFetchNextPageError ? (
            <div className="flex items-start gap-3 rounded-[1.25rem] border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="space-y-3">
                <p>{incrementalErrorMessage}</p>
                <button
                  type="button"
                  onClick={loadMore}
                  className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-white px-3.5 py-2 font-semibold text-amber-950 transition hover:border-amber-400"
                >
                  Retry loading more
                </button>
              </div>
            </div>
          ) : null}

          <MarketplaceLoadMoreSentinel
            disabled={!section.hasNextPage || section.isFetchNextPageError}
            isLoading={section.isFetchingNextPage}
            onLoadMore={loadMore}
          />
        </div>
      )}
    </section>
  );
}

export function MarketplaceResultsB({
  available,
  booked,
  showBooked,
}: MarketplaceResultsBProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const columns = useMarketplaceGridColumns(containerRef);
  const showBookedSection =
    showBooked && (booked.isInitialLoading || booked.isInitialError || booked.totalCount > 0);

  return (
    <div ref={containerRef} className="space-y-6">
      <MarketplaceResultSection
        columns={columns}
        title="Available placements"
        initialErrorMessage="Unable to load the available placements right now."
        incrementalErrorMessage="We couldn’t load the next batch of available placements."
        emptyMessage={
          showBookedSection
            ? 'No available placements match your filters. Matching booked placements are shown below.'
            : 'No placements match your filters. Try adjusting your search.'
        }
        section={available}
      />

      {showBookedSection ? (
        <MarketplaceResultSection
          columns={columns}
          title="Currently booked"
          initialErrorMessage="Unable to load booked placements right now."
          incrementalErrorMessage="We couldn’t load the next batch of booked placements."
          sectionClassName="space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.22)]"
          section={booked}
          emptyMessage="No booked placements match your filters."
        />
      ) : null}
    </div>
  );
}
