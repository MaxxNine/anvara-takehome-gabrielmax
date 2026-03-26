import Link from 'next/link';

import type { AdSlot } from '@/lib/types';
import { formatReach, getTypeBadgeColor } from '../../components-b/format-helpers';

type RelatedListingsBProps = {
  listings: AdSlot[];
};

export function RelatedListingsB({ listings }: RelatedListingsBProps) {
  if (listings.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-[--color-foreground]">
        More Placements You Might Like
      </h3>

      <div className="grid gap-3 sm:grid-cols-3">
        {listings.map((slot) => (
          <Link
            key={slot.id}
            href={`/marketplace/${slot.id}`}
            className="group rounded-xl border border-[--color-border] p-4 transition-all duration-200 hover:border-[--color-primary] hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getTypeBadgeColor(slot.type)}`}>
                {slot.type}
              </span>
              <span className="text-sm font-bold text-[--color-foreground]">
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </div>

            <h4 className="text-sm font-semibold text-[--color-foreground] group-hover:text-[--color-primary]">
              {slot.name}
            </h4>

            {slot.publisher && (
              <p className="mt-1 text-xs text-[--color-muted]">
                by {slot.publisher.name}
                {slot.publisher.monthlyViews ? (
                  <> · {formatReach(slot.publisher.monthlyViews)} reach</>
                ) : null}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
