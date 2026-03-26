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
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${getTypeBadgeColor(
            slot.type
          )}`}
        >
          {slot.type}
        </span>
        {slot.publisher?.category && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            {slot.publisher.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{slot.name}</h3>

      {/* Publisher row */}
      {slot.publisher && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-sm text-slate-600">by {slot.publisher.name}</span>
          {slot.publisher.isVerified && (
            <BadgeCheck className="h-3.5 w-3.5 text-[#1b64f2]" />
          )}
        </div>
      )}

      {/* Description */}
      {slot.description && (
        <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-2">
          {slot.description}
        </p>
      )}

      {/* Social proof row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {slot.publisher?.monthlyViews ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatReachLabel(slot.type, slot.publisher.monthlyViews)}</span>
          </div>
        ) : null}
        {placementCount > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-[#1b64f2]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Booked {placementCount}x</span>
          </div>
        )}
      </div>

      {/* Footer: availability + price */}
      <div className="mt-6 flex items-end justify-between border-t border-slate-200 pt-4">
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            slot.isAvailable ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              slot.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
          {slot.isAvailable ? 'Available' : 'Booked'}
        </span>
        <div className="text-right">
          <p className="text-xl font-bold tracking-tight text-slate-950">
            ${Number(slot.basePrice).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">per month</p>
        </div>
      </div>
    </>
  );
}

export function AdSlotCardB({ slot }: AdSlotCardBProps) {
  const accentBorder = getTypeAccentColor(slot.type);

  if (!slot.isAvailable) {
    return (
      <div
        className={`relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50/90 border-l-4 ${accentBorder} p-6 opacity-80`}
      >
        <CardContent slot={slot} />
      </div>
    );
  }

  return (
    <AdSlotCardLink
      eventParams={adSlotEventParams(slot)}
      slotId={slot.id}
      className={`block overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white border-l-4 ${accentBorder} p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_70px_-38px_rgba(27,100,242,0.28)]`}
    >
      <CardContent slot={slot} />
    </AdSlotCardLink>
  );
}
