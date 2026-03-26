import type { AdSlotType } from '@/lib/types';

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

const accentColors: Record<AdSlotType, string> = {
  DISPLAY: 'border-l-blue-500',
  VIDEO: 'border-l-red-500',
  NATIVE: 'border-l-emerald-500',
  NEWSLETTER: 'border-l-purple-500',
  PODCAST: 'border-l-orange-500',
};

export function getTypeAccentColor(type: AdSlotType): string {
  return accentColors[type] ?? 'border-l-gray-500';
}

const typeBadgeColors: Record<AdSlotType, string> = {
  DISPLAY: 'bg-blue-500/10 text-blue-400',
  VIDEO: 'bg-red-500/10 text-red-400',
  NATIVE: 'bg-emerald-500/10 text-emerald-400',
  NEWSLETTER: 'bg-purple-500/10 text-purple-400',
  PODCAST: 'bg-orange-500/10 text-orange-400',
};

export function getTypeBadgeColor(type: AdSlotType): string {
  return typeBadgeColors[type] ?? 'bg-gray-500/10 text-gray-400';
}
