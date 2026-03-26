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
      <h3 className="mb-4 text-lg font-semibold tracking-tight text-slate-950">
        More Placements You Might Like
      </h3>

      <div className="grid gap-3 sm:grid-cols-3">
        {listings.map((slot) => (
          <Link
            key={slot.id}
            href={`/marketplace/${slot.id}`}
            className="group rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_24px_60px_-38px_rgba(27,100,242,0.24)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${getTypeBadgeColor(slot.type)}`}>
                {slot.type}
              </span>
              <span className="text-sm font-bold text-slate-950">
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </div>

            <h4 className="text-sm font-semibold text-slate-950 group-hover:text-[#1b64f2]">
              {slot.name}
            </h4>

            {slot.publisher && (
              <p className="mt-1 text-xs text-slate-600">
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
