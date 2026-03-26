'use client';

import { useState, type ReactNode } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BadgeCheck, Eye, Flame, Gauge } from 'lucide-react';

import { adSlotEventParams } from '@/lib/analytics';
import type { AdSlot } from '@/lib/types';
import { AdSlotCardLink } from '../../components/ad-slot-card-link';
import {
  formatEstimatedCpm,
  formatReachLabel,
  getAudienceSize,
  getTypeAccentColor,
  getTypeBadgeColor,
} from '../format-helpers';

type AdSlotCardBProps = {
  slot: AdSlot;
};

type CardMetricItem = {
  key: string;
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
};

function CardSignalTooltip({
  icon,
  label,
  tone = 'default',
}: {
  icon: ReactNode;
  label: string;
  tone?: 'default' | 'emphasis';
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative pointer-events-auto">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)] transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b64f2]/20 ${
          tone === 'emphasis'
            ? 'border-amber-200 text-amber-700'
            : 'border-slate-200 text-[#1b64f2]'
        }`}
      >
        {icon}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.5)]"
            role="tooltip"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CardMetric({
  className,
  icon,
  label,
  value,
}: {
  className?: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-[1rem] border border-slate-200/80 bg-slate-50/85 px-3.5 py-3 ${
        className ?? ''
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="truncate text-sm font-semibold text-slate-700">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CardContent({ slot }: AdSlotCardBProps) {
  const audienceSize = getAudienceSize(slot);
  const estimatedCpm = formatEstimatedCpm(Number(slot.basePrice), audienceSize);
  const hasHighReachSignal = Boolean(audienceSize && audienceSize > 100_000);

  const metrics: CardMetricItem[] = [];

  if (audienceSize) {
    metrics.push({
      key: 'reach',
      icon: <Eye className="h-4 w-4" />,
      label: 'Reach',
      value: formatReachLabel(slot.type, audienceSize),
      className: 'min-w-0',
    });
  }

  if (estimatedCpm) {
    metrics.push({
      key: 'cpm',
      icon: <Gauge className="h-4 w-4" />,
      label: 'Est. CPM',
      value: `$${estimatedCpm}`,
      className: 'w-full sm:w-[9rem] sm:min-w-[9rem]',
    });
  }

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${getTypeBadgeColor(
            slot.type
          )}`}
        >
          {slot.type}
        </span>

        <div className="flex items-center gap-2">
          {hasHighReachSignal && (
            <CardSignalTooltip
              icon={<Flame className="h-4 w-4" />}
              label="High-reach placement"
              tone="emphasis"
            />
          )}
          {slot.publisher?.isVerified && (
            <CardSignalTooltip
              icon={<BadgeCheck className="h-4 w-4" />}
              label="Verified publisher"
            />
          )}
        </div>
      </div>

      <h3 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-slate-950">{slot.name}</h3>

      {slot.publisher && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
          <span>by {slot.publisher.name}</span>
        </div>
      )}

      {slot.description && (
        <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-2">{slot.description}</p>
      )}

      {metrics.length > 0 && (
        <div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_9rem]">
          {metrics.map((metric) => (
            <CardMetric
              key={metric.key}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              className={metric.className}
            />
          ))}
        </div>
      )}

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
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1b64f2]">
              View details
              <ArrowUpRight className="h-4 w-4" />
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
  const cardShell = `relative overflow-hidden rounded-[1.5rem] border border-slate-200 border-l-4 ${accentBorder} p-6`;

  if (!slot.isAvailable) {
    return (
      <div className={`${cardShell} bg-slate-50/90 opacity-80`}>
        <CardContent slot={slot} />
      </div>
    );
  }

  return (
    <div
      className={`${cardShell} group bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_70px_-38px_rgba(27,100,242,0.28)]`}
    >
      <AdSlotCardLink
        eventParams={adSlotEventParams(slot)}
        slotId={slot.id}
        className="absolute inset-0 z-0 rounded-[1.5rem]"
      >
        <span className="sr-only">View details for {slot.name}</span>
      </AdSlotCardLink>

      <div className="relative z-10 pointer-events-none">
        <CardContent slot={slot} />
      </div>
    </div>
  );
}
