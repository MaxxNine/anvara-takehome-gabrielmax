'use client';

import { useEffect, useRef } from 'react';

type MarketplaceLoadMoreSentinelProps = {
  disabled: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
};

export function MarketplaceLoadMoreSentinel({
  disabled,
  isLoading,
  onLoadMore,
}: MarketplaceLoadMoreSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = sentinelRef.current;

    if (disabled || !element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '480px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [disabled, onLoadMore]);

  if (disabled && !isLoading) {
    return null;
  }

  return (
    <div
      ref={sentinelRef}
      className="flex min-h-16 items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-white/70 px-4 text-sm text-slate-500"
    >
      {isLoading ? 'Loading more placements...' : 'Loading more placements as you scroll...'}
    </div>
  );
}
