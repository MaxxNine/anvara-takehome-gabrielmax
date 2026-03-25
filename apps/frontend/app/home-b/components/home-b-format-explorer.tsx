'use client';

import { useRotatingIndex } from './use-rotating-index';
import type { HomeBPreviewSlot } from '../content';
import { HomeBSlotPreviewCard } from './home-b-slot-card';

type HomeBFormatExplorerProps = {
  slots: HomeBPreviewSlot[];
};

export function HomeBFormatExplorer({ slots }: HomeBFormatExplorerProps) {
  const { activeIndex, pauseRotation, resumeRotation, setActiveIndex } = useRotatingIndex(
    slots.length,
    4200
  );

  const activeSlot = slots[activeIndex];

  return (
    <div
      className="relative"
      onMouseEnter={pauseRotation}
      onMouseLeave={resumeRotation}
      onFocusCapture={pauseRotation}
      onBlurCapture={resumeRotation}
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {slots.map((slot, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={`${slot.type}-${slot.name}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-[--color-primary] text-white shadow-[0_14px_30px_rgba(62,107,255,0.25)]'
                  : 'border border-[--color-border] bg-white text-[--color-foreground] hover:border-[--color-primary] hover:text-[--color-primary]'
              }`}
              aria-pressed={isActive}
            >
              {slot.type}
            </button>
          );
        })}
      </div>

      <HomeBSlotPreviewCard slot={activeSlot} />
    </div>
  );
}
