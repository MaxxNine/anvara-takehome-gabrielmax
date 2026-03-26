import { Mail, Mic, Monitor } from 'lucide-react';

import type { HomeBPublisherInventoryItem } from '../../../content';

type PublisherInventoryItemCardProps = {
  item: HomeBPublisherInventoryItem;
};

export function PublisherInventoryItemCard({ item }: PublisherInventoryItemCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${
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
          <p className="text-sm font-semibold text-slate-900 sm:text-[15px]">{item.title}</p>
          <p className="text-xs text-slate-500">{item.subtitle}</p>
        </div>
      </div>

      <span
        className={`self-start text-xs font-bold sm:self-auto ${
          item.status === 'Live' ? 'text-emerald-600' : 'text-amber-600'
        }`}
      >
        {item.status}
      </span>
    </div>
  );
}
