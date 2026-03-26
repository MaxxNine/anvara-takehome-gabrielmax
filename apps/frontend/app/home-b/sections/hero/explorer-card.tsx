import Image from 'next/image';

import type { HomeBPreviewSlot } from '../../content';

type HomeBExplorerCardProps = {
  compact?: boolean;
  slot: HomeBPreviewSlot;
};

const typeBadgeClasses: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-800',
  NEWSLETTER: 'bg-indigo-100 text-indigo-800',
  NATIVE: 'bg-slate-100 text-slate-800',
  PODCAST: 'bg-purple-100 text-purple-800',
  VIDEO: 'bg-sky-100 text-sky-800',
};

export function HomeBExplorerCard({ compact = false, slot }: HomeBExplorerCardProps) {
  return (
    <article
      className={`flex items-center rounded-lg bg-white shadow-sm ${
        compact ? 'gap-2.5 p-2 sm:gap-3 sm:p-2.5' : 'gap-3 p-2.5 sm:gap-3.5 sm:rounded-xl sm:p-3'
      }`}
    >
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-lg ${
          compact ? 'h-11 w-11 sm:h-14 sm:w-14' : 'h-14 w-14 sm:h-16 sm:w-16'
        }`}
      >
        <Image
          src={slot.imageUrl}
          alt={slot.imageAlt}
          fill
          sizes={compact ? '(max-width: 640px) 44px, 56px' : '(max-width: 640px) 56px, 64px'}
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`truncate font-semibold text-slate-900 ${
              compact ? 'text-[12px] leading-snug sm:text-[13px]' : 'text-[13px] sm:text-sm'
            }`}
          >
            {slot.name}
          </h3>
        </div>
        <p
          className={`truncate text-slate-500 ${
            compact ? 'mt-0.5 text-[10px] sm:text-[11px]' : 'mt-0.5 text-[11px] sm:text-xs'
          }`}
        >
          {slot.publisher}
        </p>
        <div className={`flex items-center gap-2 ${compact ? 'mt-1' : 'mt-1.5'}`}>
          <span
            className={`rounded-full font-bold uppercase tracking-wider ${
              compact ? 'px-1.5 py-0.5 text-[8px] sm:px-2 sm:text-[9px]' : 'px-2 py-0.5 text-[9px] sm:text-[10px]'
            } ${
              typeBadgeClasses[slot.type] ?? 'bg-slate-100 text-slate-800'
            }`}
          >
            {slot.type}
          </span>
          <span
            className={`truncate font-semibold text-slate-700 ${
              compact ? 'text-[10px] sm:text-[11px]' : 'text-[11px] sm:text-xs'
            }`}
          >
            {slot.priceLabel}
          </span>
        </div>
      </div>
    </article>
  );
}
