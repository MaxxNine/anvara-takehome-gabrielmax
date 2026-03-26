'use client';

type MarketplaceErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MarketplaceError({ error, reset }: MarketplaceErrorProps) {
  void error;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
      </div>

      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
        <p>Failed to load ad slots.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
