import { adSlotEventParams } from '@/lib/analytics';
import type { AdSlot } from '@/lib/types';
import { AdSlotCardLink } from './ad-slot-card-link';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

type AdSlotCardProps = {
  slot: AdSlot;
};

function AdSlotCardContent({ slot }: AdSlotCardProps) {
  return (
    <>
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-semibold">{slot.name}</h3>
        <span className={`rounded px-2 py-0.5 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}>
          {slot.type}
        </span>
      </div>

      {slot.publisher ? (
        <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
      ) : null}

      {slot.description ? (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
      ) : null}

      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
        >
          {slot.isAvailable ? 'Available' : 'Booked'}
        </span>
        <span className="font-semibold text-[--color-primary]">
          ${Number(slot.basePrice).toLocaleString()}/mo
        </span>
      </div>
    </>
  );
}

export function AdSlotCard({ slot }: AdSlotCardProps) {
  if (!slot.isAvailable) {
    return (
      <div className="rounded-lg border border-[--color-border] p-4 opacity-60">
        <AdSlotCardContent slot={slot} />
      </div>
    );
  }

  return (
    <AdSlotCardLink
      eventParams={adSlotEventParams(slot)}
      slotId={slot.id}
      className="block rounded-lg border border-[--color-border] p-4 transition-shadow hover:shadow-md"
    >
      <AdSlotCardContent slot={slot} />
    </AdSlotCardLink>
  );
}
