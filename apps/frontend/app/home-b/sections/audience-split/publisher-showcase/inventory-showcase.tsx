import { homeBPublisherInventoryItems } from '../../../content';
import { PublisherInventoryItemCard } from './inventory-item';

export function PublisherInventoryShowcase() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.25)] sm:rounded-[2rem] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-950 sm:text-lg">Inventory Manager</h3>
        <div className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold text-cyan-700">
          + Add Slot
        </div>
      </div>

      <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        {homeBPublisherInventoryItems.map((item) => (
          <PublisherInventoryItemCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}
