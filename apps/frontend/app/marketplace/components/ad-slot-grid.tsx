import type { AdSlot } from '@/lib/types';
import { AdSlotCard } from './ad-slot-card';

type AdSlotGridProps = {
  adSlots: AdSlot[];
};

export function AdSlotGrid({ adSlots }: AdSlotGridProps) {
  if (adSlots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[--color-border] p-12 text-center text-[--color-muted]">
        No ad slots available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <AdSlotCard key={slot.id} slot={slot} />
      ))}
    </div>
  );
}
