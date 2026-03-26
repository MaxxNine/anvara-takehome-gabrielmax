import Image from 'next/image';

import type { HomeBPreviewSlot } from '../content';

type HomeBExplorerCardProps = {
  slot: HomeBPreviewSlot;
};

const typeBadgeClasses: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-800',
  NEWSLETTER: 'bg-indigo-100 text-indigo-800',
  NATIVE: 'bg-slate-100 text-slate-800',
  PODCAST: 'bg-purple-100 text-purple-800',
  VIDEO: 'bg-sky-100 text-sky-800',
};

export function HomeBExplorerCard({ slot }: HomeBExplorerCardProps) {
  return (
    <article className="flex items-center gap-3.5 rounded-xl bg-white p-3 shadow-sm">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={slot.imageUrl}
          alt={slot.imageAlt}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-900">{slot.name}</h3>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{slot.publisher}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              typeBadgeClasses[slot.type] ?? 'bg-slate-100 text-slate-800'
            }`}
          >
            {slot.type}
          </span>
          <span className="text-xs font-semibold text-slate-700">{slot.priceLabel}</span>
        </div>
      </div>
    </article>
  );
}
