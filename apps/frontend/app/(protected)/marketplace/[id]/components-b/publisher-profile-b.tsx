import { BadgeCheck, ExternalLink } from 'lucide-react';

import type { PublisherSummary } from '@/lib/types';

type PublisherProfileBProps = {
  publisher: PublisherSummary;
};

export function PublisherProfileB({ publisher }: PublisherProfileBProps) {
  const initial = publisher.name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Avatar */}
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-[#1b64f2]">
        {initial}
      </div>

      <div className="min-w-0 flex-1">
        {/* Name + verified */}
        <div className="flex items-center gap-1.5">
          <h2 className="truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
            {publisher.name}
          </h2>
          {publisher.isVerified && (
            <BadgeCheck className="h-4.5 w-4.5 flex-shrink-0 text-[#1b64f2]" />
          )}
        </div>

        {/* Category + website */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {publisher.category && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {publisher.category}
            </span>
          )}
          {publisher.website && (
            <a
              href={publisher.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[--color-primary] hover:underline"
            >
              <span className="truncate">{publisher.website.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
