'use client';

type MarketplaceResultsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function MarketplaceResultsErrorState({
  message,
  onRetry,
}: MarketplaceResultsErrorStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-900">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center justify-center rounded-xl border border-rose-300 bg-white px-3.5 py-2 font-semibold text-rose-900 transition hover:border-rose-400"
      >
        Retry
      </button>
    </div>
  );
}
