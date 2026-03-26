import type { AdSlot, AdSlotType } from '@/lib/types';

export function formatReach(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

const reachLabels: Record<AdSlotType, string> = {
  DISPLAY: 'views/mo',
  VIDEO: 'views/mo',
  NATIVE: 'views/mo',
  NEWSLETTER: 'subscribers',
  PODCAST: 'listeners/mo',
};

export function formatReachLabel(type: AdSlotType, views: number): string {
  return `${formatReach(views)} ${reachLabels[type]}`;
}

export function getAudienceSize(slot: Pick<AdSlot, 'type' | 'publisher'>): number | null {
  if (slot.type === 'NEWSLETTER') {
    return slot.publisher?.subscriberCount ?? slot.publisher?.monthlyViews ?? null;
  }

  return slot.publisher?.monthlyViews ?? slot.publisher?.subscriberCount ?? null;
}

export function formatAudienceSummary(type: AdSlotType, audienceSize: number): string {
  const formatted = formatReach(audienceSize);

  switch (type) {
    case 'NEWSLETTER':
      return `${formatted} subscribers`;
    case 'PODCAST':
      return `${formatted} monthly listeners`;
    case 'VIDEO':
      return `${formatted} monthly viewers`;
    case 'DISPLAY':
    case 'NATIVE':
    default:
      return `${formatted} monthly readers`;
  }
}

export function formatEstimatedCpm(price: number, audienceSize?: number | null): string | null {
  if (!audienceSize || audienceSize <= 0) {
    return null;
  }

  return (price / audienceSize * 1000).toFixed(2);
}

const accentColors: Record<AdSlotType, string> = {
  DISPLAY: 'border-l-blue-400',
  VIDEO: 'border-l-rose-400',
  NATIVE: 'border-l-emerald-400',
  NEWSLETTER: 'border-l-violet-400',
  PODCAST: 'border-l-amber-400',
};

export function getTypeAccentColor(type: AdSlotType): string {
  return accentColors[type] ?? 'border-l-gray-500';
}

const typeBadgeColors: Record<AdSlotType, string> = {
  DISPLAY: 'bg-blue-50 text-blue-700',
  VIDEO: 'bg-rose-50 text-rose-700',
  NATIVE: 'bg-emerald-50 text-emerald-700',
  NEWSLETTER: 'bg-violet-50 text-violet-700',
  PODCAST: 'bg-amber-50 text-amber-700',
};

export function getTypeBadgeColor(type: AdSlotType): string {
  return typeBadgeColors[type] ?? 'bg-gray-500/10 text-gray-400';
}
