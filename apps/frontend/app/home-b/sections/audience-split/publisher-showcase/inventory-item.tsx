import { Mail, Mic, Monitor } from 'lucide-react';

import type { HomeBPublisherInventoryItem } from '../../../content';

type PublisherInventoryItemCardProps = {
  item: HomeBPublisherInventoryItem;
};

export function PublisherInventoryItemCard({ item }: PublisherInventoryItemCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3.5 ring-1 ring-slate-200 sm:gap-4 sm:px-4 sm:py-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${
            item.type === 'display'
              ? 'bg-blue-100 text-[#1b64f2]'
              : item.type === 'podcast'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-cyan-100 text-cyan-700'
          }`}
        >
          {item.type === 'display' ? (
            <Monitor className="h-5 w-5" />
          ) : item.type === 'podcast' ? (
            <Mic className="h-5 w-5" />
          ) : (
            <Mail className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
            {item.title}
          </p>
          <p className="truncate text-xs text-slate-500">{item.subtitle}</p>
        </div>
      </div>

      <span
        className={`shrink-0 text-xs font-bold ${
          item.status === 'Live' ? 'text-emerald-600' : 'text-amber-600'
        }`}
      >
        {item.status}
      </span>
    </div>
  );
}
