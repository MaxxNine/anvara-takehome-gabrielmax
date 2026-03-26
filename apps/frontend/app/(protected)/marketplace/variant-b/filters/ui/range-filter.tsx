'use client';

import { useId } from 'react';

import { cn } from '@/lib/utils';

import type { NumericRange, NumericRangeBounds } from '../model/types';

type MarketplaceRangeFilterProps = {
  bounds: NumericRangeBounds;
  disabledLabel: string;
  formatValue: (value: number) => string;
  helperText?: string | null;
  maxInputLabel: string;
  minInputLabel: string;
  onChange: (value: NumericRange) => void;
  step: number;
  value: NumericRange;
};

const sliderScaleMax = 1000;

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function formatNumberInput(value: number | null): string {
  return value === null ? '' : String(value);
}

function encodeSliderValue(value: number, bounds: NumericRangeBounds): number {
  if (!bounds.hasData || bounds.max <= bounds.min) {
    return 0;
  }

  const min = Math.max(0, bounds.min);
  const max = Math.max(min + 1, bounds.max);
  const start = Math.log10(min + 1);
  const end = Math.log10(max + 1);
  const current = Math.log10(Math.max(value, min) + 1);

  return ((current - start) / (end - start)) * sliderScaleMax;
}

function decodeSliderValue(
  sliderValue: number,
  bounds: NumericRangeBounds,
  step: number
): number {
  if (!bounds.hasData || bounds.max <= bounds.min) {
    return 0;
  }

  const min = Math.max(0, bounds.min);
  const max = Math.max(min + 1, bounds.max);
  const start = Math.log10(min + 1);
  const end = Math.log10(max + 1);
  const ratio = sliderValue / sliderScaleMax;
  const raw = 10 ** (start + ratio * (end - start)) - 1;
  const rounded = roundToStep(raw, step);

  return Math.min(Math.max(rounded, bounds.min), bounds.max);
}

function clampMin(nextMin: number | null, currentMax: number | null): number | null {
  if (nextMin === null) {
    return null;
  }

  if (currentMax !== null && nextMin > currentMax) {
    return currentMax;
  }

  return nextMin;
}

function clampMax(nextMax: number | null, currentMin: number | null): number | null {
  if (nextMax === null) {
    return null;
  }

  if (currentMin !== null && nextMax < currentMin) {
    return currentMin;
  }

  return nextMax;
}

export function MarketplaceRangeFilter({
  bounds,
  disabledLabel,
  formatValue,
  helperText,
  maxInputLabel,
  minInputLabel,
  onChange,
  step,
  value,
}: MarketplaceRangeFilterProps) {
  const minInputId = useId();
  const maxInputId = useId();

  if (!bounds.hasData || bounds.max <= bounds.min) {
    return (
      <div className="rounded-[1rem] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-500">
        {disabledLabel}
      </div>
    );
  }

  const effectiveMin = value.min ?? bounds.min;
  const effectiveMax = value.max ?? bounds.max;
  const minSliderValue = encodeSliderValue(effectiveMin, bounds);
  const maxSliderValue = encodeSliderValue(effectiveMax, bounds);
  const leftPercent = (minSliderValue / sliderScaleMax) * 100;
  const rightPercent = (maxSliderValue / sliderScaleMax) * 100;

  return (
    <div className="space-y-3 rounded-[1rem] border border-slate-200/80 bg-slate-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700">
          {value.min === null ? 'Any min' : formatValue(value.min)}
        </span>
        <span className="text-sm text-slate-500">to</span>
        <span className="text-sm font-semibold text-slate-700">
          {value.max === null ? 'No max' : formatValue(value.max)}
        </span>
      </div>

      <div className="relative h-12">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#1b64f2]"
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
          }}
        />

        <input
          type="range"
          min={0}
          max={sliderScaleMax}
          step={1}
          value={minSliderValue}
          aria-label={minInputLabel}
          onChange={(event) => {
            const nextMin = decodeSliderValue(Number(event.target.value), bounds, step);

            onChange({
              ...value,
              min: nextMin <= bounds.min ? null : clampMin(nextMin, value.max),
            });
          }}
          className={cn(
            'pointer-events-none absolute inset-0 h-12 w-full appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#1b64f2] [&::-webkit-slider-thumb]:shadow-[0_8px_20px_-12px_rgba(27,100,242,0.8)]',
            '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#1b64f2]'
          )}
        />

        <input
          type="range"
          min={0}
          max={sliderScaleMax}
          step={1}
          value={maxSliderValue}
          aria-label={maxInputLabel}
          onChange={(event) => {
            const sliderValue = Number(event.target.value);
            const nextMax =
              sliderValue >= sliderScaleMax
                ? null
                : decodeSliderValue(sliderValue, bounds, step);

            onChange({
              ...value,
              max: clampMax(nextMax, value.min),
            });
          }}
          className={cn(
            'pointer-events-none absolute inset-0 z-10 h-12 w-full appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-slate-950 [&::-webkit-slider-thumb]:shadow-[0_8px_20px_-12px_rgba(15,23,42,0.65)]',
            '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-slate-950]'
          )}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label htmlFor={minInputId} className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {minInputLabel}
          </span>
          <input
            id={minInputId}
            type="number"
            min={bounds.min}
            max={value.max ?? bounds.max}
            step={step}
            value={formatNumberInput(value.min)}
            placeholder={String(bounds.min)}
            onChange={(event) => {
              const nextValue = event.target.value === '' ? null : Number(event.target.value);

              onChange({
                ...value,
                min:
                  nextValue === null || nextValue <= bounds.min
                    ? null
                    : clampMin(roundToStep(nextValue, step), value.max),
              });
            }}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15"
          />
        </label>

        <label htmlFor={maxInputId} className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {maxInputLabel}
          </span>
          <input
            id={maxInputId}
            type="number"
            min={value.min ?? bounds.min}
            max={bounds.max}
            step={step}
            value={formatNumberInput(value.max)}
            placeholder="No max"
            onChange={(event) => {
              const nextValue = event.target.value === '' ? null : Number(event.target.value);

              onChange({
                ...value,
                max:
                  nextValue === null || nextValue >= bounds.max
                    ? null
                    : clampMax(roundToStep(nextValue, step), value.min),
              });
            }}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 focus:border-[#1b64f2] focus:outline-none focus:ring-2 focus:ring-[#1b64f2]/15"
          />
        </label>

        <button
          type="button"
          onClick={() =>
            onChange({
              max: null,
              min: value.min,
            })
          }
          className="inline-flex h-11 items-center justify-center self-end rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          No max
        </button>
      </div>

      {helperText ? <p className="text-xs leading-5 text-slate-500">{helperText}</p> : null}
    </div>
  );
}
