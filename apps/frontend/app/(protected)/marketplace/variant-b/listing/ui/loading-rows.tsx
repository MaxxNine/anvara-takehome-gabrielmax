'use client';

type MarketplaceLoadingRowsProps = {
  count?: number;
};

export function MarketplaceLoadingRows({
  count = 6,
}: MarketplaceLoadingRowsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-[20rem] animate-pulse rounded-[1.5rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.9))]"
        />
      ))}
    </div>
  );
}
