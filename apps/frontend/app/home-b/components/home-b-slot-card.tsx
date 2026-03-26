import type { HomeBPreviewSlot } from '../content';

const typeClasses: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  NATIVE: 'bg-slate-100 text-slate-700',
  NEWSLETTER: 'bg-indigo-100 text-indigo-700',
  PODCAST: 'bg-purple-100 text-purple-700',
  VIDEO: 'bg-pink-100 text-pink-700',
};

function getAvailabilityClasses(tone: HomeBPreviewSlot['availabilityTone']): string {
  return tone === 'available'
    ? 'bg-emerald-100 text-emerald-800'
    : 'bg-amber-100 text-amber-800';
}

type HomeBSlotPreviewCardProps = {
  slot: HomeBPreviewSlot;
  compact?: boolean;
};

export function HomeBSlotPreviewCard({ slot, compact }: HomeBSlotPreviewCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white transition-all hover:shadow-md ${compact ? 'p-6 sm:p-8' : 'p-8 shadow-sm sm:p-10'}`}>
      <div className="absolute right-0 top-0 h-48 w-48 -translate-y-16 translate-x-16 rounded-full bg-blue-50 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between text-left">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm ring-1 ring-black/5 ${typeClasses[slot.type] ?? 'bg-gray-100 text-gray-700'}`}
            >
              {slot.type}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm ring-1 ring-black/5 ${getAvailabilityClasses(slot.availabilityTone)}`}
            >
              {slot.availabilityLabel}
            </span>
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            {slot.publisher}
          </p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {slot.name}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:max-w-md">
            {slot.description}
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:mt-0 sm:items-end sm:text-right">
          <div className="rounded-2xl border border-gray-100 bg-slate-50 px-6 py-5 shadow-inner">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Monthly rate
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {slot.priceLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
