import { BadgeCheck, ExternalLink } from 'lucide-react';

import type { PublisherSummary } from '@/lib/types';

type PublisherProfileBProps = {
  publisher: PublisherSummary;
};

export function PublisherProfileB({ publisher }: PublisherProfileBProps) {
  const initial = publisher.name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[--color-primary] text-lg font-bold text-white">
        {initial}
      </div>

      <div className="min-w-0 flex-1">
        {/* Name + verified */}
        <div className="flex items-center gap-1.5">
          <h2 className="truncate text-lg font-semibold text-[--color-foreground]">
            {publisher.name}
          </h2>
          {publisher.isVerified && (
            <BadgeCheck className="h-4.5 w-4.5 flex-shrink-0 text-blue-400" />
          )}
        </div>

        {/* Category + website */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[--color-muted]">
          {publisher.category && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium">
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
