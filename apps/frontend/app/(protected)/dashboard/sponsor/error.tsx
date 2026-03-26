'use client';

interface SponsorDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SponsorDashboardError({
  error,
  reset,
}: SponsorDashboardErrorProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
      <h2 className="text-lg font-semibold">Failed to load your campaigns</h2>
      <p className="mt-2 text-sm">
        {error.message || 'Something went wrong while loading the sponsor dashboard.'}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
      >
        Try again
      </button>
    </div>
  );
}
