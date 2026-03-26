import Image from 'next/image';

import type { HomeBPreviewSlot } from '../../content';

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
    <article className="flex items-center gap-3 rounded-lg bg-white p-2.5 shadow-sm sm:gap-3.5 sm:rounded-xl sm:p-3">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
        <Image
          src={slot.imageUrl}
          alt={slot.imageAlt}
          fill
          sizes="(max-width: 640px) 56px, 64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[13px] font-semibold text-slate-900 sm:text-sm">
            {slot.name}
          </h3>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-slate-500 sm:text-xs">{slot.publisher}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${
              typeBadgeClasses[slot.type] ?? 'bg-slate-100 text-slate-800'
            }`}
          >
            {slot.type}
          </span>
          <span className="truncate text-[11px] font-semibold text-slate-700 sm:text-xs">
            {slot.priceLabel}
          </span>
        </div>
      </div>
    </article>
  );
}
