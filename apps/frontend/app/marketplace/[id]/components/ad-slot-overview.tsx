import type { AdSlot } from '@/lib/types';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

type AdSlotOverviewProps = {
  adSlot: AdSlot;
};

export function AdSlotOverview({ adSlot }: AdSlotOverviewProps) {
  return (
    <>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{adSlot.name}</h1>
          {adSlot.publisher ? (
            <p className="text-[--color-muted]">
              by {adSlot.publisher.name}
              {adSlot.publisher.website ? (
                <>
                  {' '}
                  ·{' '}
                  <a
                    href={adSlot.publisher.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[--color-primary] hover:underline"
                  >
                    {adSlot.publisher.website}
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
        <span className={`rounded px-3 py-1 text-sm ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
          {adSlot.type}
        </span>
      </div>

      {adSlot.description ? <p className="mb-6 text-[--color-muted]">{adSlot.description}</p> : null}
    </>
  );
}
