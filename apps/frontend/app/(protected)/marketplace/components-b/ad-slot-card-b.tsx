import { BadgeCheck, Eye, TrendingUp } from 'lucide-react';

import { adSlotEventParams } from '@/lib/analytics';
import type { AdSlot } from '@/lib/types';
import { AdSlotCardLink } from '../components/ad-slot-card-link';
import { formatReachLabel, getTypeAccentColor, getTypeBadgeColor } from './format-helpers';

type AdSlotCardBProps = {
  slot: AdSlot;
};

function CardContent({ slot }: AdSlotCardBProps) {
  const placementCount = slot._count?.placements ?? 0;

  return (
    <>
      {/* Header: type badge + category */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${getTypeBadgeColor(slot.type)}`}>
          {slot.type}
        </span>
        {slot.publisher?.category && (
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[--color-muted]">
            {slot.publisher.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-[--color-foreground]">{slot.name}</h3>

      {/* Publisher row */}
      {slot.publisher && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-sm text-[--color-muted]">by {slot.publisher.name}</span>
          {slot.publisher.isVerified && (
            <BadgeCheck className="h-3.5 w-3.5 text-blue-400" />
          )}
        </div>
      )}

      {/* Description */}
      {slot.description && (
        <p className="mt-2.5 text-sm leading-relaxed text-[--color-muted] line-clamp-2">
          {slot.description}
        </p>
      )}

      {/* Social proof row */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {slot.publisher?.monthlyViews ? (
          <div className="flex items-center gap-1.5 text-xs text-[--color-muted]">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatReachLabel(slot.type, slot.publisher.monthlyViews)}</span>
          </div>
        ) : null}
        {placementCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[--color-muted]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Booked {placementCount}x</span>
          </div>
        )}
      </div>

      {/* Footer: availability + price */}
      <div className="mt-4 flex items-end justify-between border-t border-[--color-border] pt-3">
        <span className={`flex items-center gap-1.5 text-xs font-medium ${slot.isAvailable ? 'text-emerald-400' : 'text-[--color-muted]'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${slot.isAvailable ? 'bg-emerald-400' : 'bg-[--color-muted]'}`} />
          {slot.isAvailable ? 'Available' : 'Booked'}
        </span>
        <div className="text-right">
          <p className="text-lg font-bold text-[--color-foreground]">
            ${Number(slot.basePrice).toLocaleString()}
          </p>
          <p className="text-[11px] text-[--color-muted]">per month</p>
        </div>
      </div>
    </>
  );
}

export function AdSlotCardB({ slot }: AdSlotCardBProps) {
  const accentBorder = getTypeAccentColor(slot.type);

  if (!slot.isAvailable) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-[--color-border] border-l-4 ${accentBorder} p-5 opacity-50`}>
        <CardContent slot={slot} />
      </div>
    );
  }

  return (
    <AdSlotCardLink
      eventParams={adSlotEventParams(slot)}
      slotId={slot.id}
      className={`block overflow-hidden rounded-xl border border-[--color-border] border-l-4 ${accentBorder} p-5 transition-all duration-200 hover:border-[--color-primary] hover:shadow-[0_8px_30px_-12px_rgba(27,100,242,0.3)] hover:scale-[1.01]`}
    >
      <CardContent slot={slot} />
    </AdSlotCardLink>
  );
}
