import type { HomeBPreviewSlot } from '../content';

type HomeBSlotPreviewCardProps = {
  compact?: boolean;
  slot: HomeBPreviewSlot;
};

const slotTypeClasses = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  NEWSLETTER: 'bg-indigo-100 text-indigo-700',
  NATIVE: 'bg-slate-100 text-slate-700',
  PODCAST: 'bg-lime-100 text-lime-700',
  VIDEO: 'bg-sky-100 text-sky-700',
} as const;

function getAvailabilityClasses(tone: HomeBPreviewSlot['availabilityTone']): string {
  if (tone === 'available') {
    return 'bg-lime-100 text-lime-800';
  }

  return 'bg-[--color-home-surface-alt] text-[--color-muted]';
}

export function HomeBSlotPreviewCard({
  compact = false,
  slot,
}: HomeBSlotPreviewCardProps) {
  return (
    <article
      className={`rounded-[1.75rem] border border-[--color-border] bg-white shadow-[0_24px_80px_rgba(17,24,39,0.08)] ${
        compact ? 'p-5' : 'p-6 sm:p-7'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            slotTypeClasses[slot.type]
          }`}
        >
          {slot.type}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getAvailabilityClasses(slot.availabilityTone)}`}
        >
          {slot.availabilityLabel}
        </span>
      </div>

      <div className={compact ? 'mt-4 space-y-2' : 'mt-5 space-y-3'}>
        <div className="space-y-1">
          <p className="text-sm font-medium text-[--color-muted]">{slot.publisher}</p>
          <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-semibold text-[--color-foreground]`}>
            {slot.name}
          </h3>
        </div>

        <p className="max-w-xl text-sm leading-6 text-[--color-muted]">{slot.description}</p>
      </div>

      <div
        className={`mt-6 grid gap-3 ${
          compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        <div className="rounded-2xl bg-[--color-home-surface-alt] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[--color-muted]">
            Monthly rate
          </p>
          <p className="mt-2 text-lg font-semibold text-[--color-foreground]">{slot.priceLabel}</p>
        </div>
        <div className="rounded-2xl border border-[--color-border] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[--color-muted]">
            Marketplace fit
          </p>
          <p className="mt-2 text-sm font-medium text-[--color-foreground]">
            Structured inventory with clearer sponsor context
          </p>
        </div>
      </div>
    </article>
  );
}
