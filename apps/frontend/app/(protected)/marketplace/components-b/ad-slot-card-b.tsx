import { BadgeCheck, Eye, TrendingUp } from 'lucide-react';

import { adSlotEventParams } from '@/lib/analytics';
import type { AdSlot } from '@/lib/types';
import { AdSlotCardLink } from '../components/ad-slot-card-link';
import {
  formatEstimatedCpm,
  formatReachLabel,
  getAudienceSize,
  getTypeAccentColor,
  getTypeBadgeColor,
} from './format-helpers';

type AdSlotCardBProps = {
  slot: AdSlot;
};

function getMomentumBadge(slot: AdSlot): { label: string; className: string } | null {
  const placementCount = slot._count?.placements ?? 0;
  const audienceSize = getAudienceSize(slot);

  if (placementCount >= 3) {
    return {
      label: 'Most Booked',
      className: 'bg-amber-50 text-amber-700',
    };
  }

  if (audienceSize && audienceSize >= 100_000) {
    return {
      label: 'High Reach',
      className: 'bg-emerald-50 text-emerald-700',
    };
  }

  return null;
}

function CardContent({ slot }: AdSlotCardBProps) {
  const placementCount = slot._count?.placements ?? 0;
  const audienceSize = getAudienceSize(slot);
  const estimatedCpm = formatEstimatedCpm(Number(slot.basePrice), audienceSize);
  const momentumBadge = getMomentumBadge(slot);
  const audienceCategory = slot.publisher?.category;

  return (
    <>
      {/* Header: type badge + momentum signal */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${getTypeBadgeColor(
            slot.type
          )}`}
        >
          {slot.type}
        </span>
        {momentumBadge && (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${momentumBadge.className}`}>
            {momentumBadge.label}
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

      {audienceCategory && <p className="mt-2 text-sm font-medium text-slate-500">Audience: {audienceCategory}</p>}

      {/* Description */}
      {slot.description && (
        <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-2">
          {slot.description}
        </p>
      )}

      {/* Social proof row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {audienceSize ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatReachLabel(slot.type, audienceSize)}</span>
          </div>
        ) : null}
        {estimatedCpm && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-[#1b64f2]">
            <span>Est. CPM ${estimatedCpm}</span>
          </div>
        )}
        {placementCount > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Booked {placementCount}x</span>
          </div>
        )}
      </div>

      {/* Footer: availability + price */}
      <div className="mt-6 flex items-end justify-between border-t border-slate-200 pt-4">
        <div>
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
          {slot.isAvailable && (
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#1b64f2]">
              View details
              <span aria-hidden="true">→</span>
            </span>
          )}
        </div>
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
