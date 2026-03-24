'use client';

import { useActionState, useEffect } from 'react';

import type { AdSlot, AdSlotType } from '@/lib/types';
import { initialActionState } from '@/lib/action-types';
import { SubmitButton } from '@/app/components/submit-button';
import { createAdSlotAction } from '../actions/create-ad-slot';
import { updateAdSlotAction } from '../actions/update-ad-slot';

type AdSlotFormProps = {
  adSlot?: AdSlot;
  onClose: () => void;
};

const AD_SLOT_TYPES: { value: AdSlotType; label: string }[] = [
  { value: 'DISPLAY', label: 'Display' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'NATIVE', label: 'Native' },
  { value: 'NEWSLETTER', label: 'Newsletter' },
  { value: 'PODCAST', label: 'Podcast' },
];

export function AdSlotForm({ adSlot, onClose }: AdSlotFormProps) {
  const isEdit = !!adSlot;
  const action = isEdit ? updateAdSlotAction : createAdSlotAction;
  const [state, formAction] = useActionState(action, initialActionState);

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {isEdit && <input type="hidden" name="id" value={adSlot.id} />}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={adSlot?.name ?? ''}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
        />
        {state.fieldErrors?.name?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={adSlot?.description ?? ''}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={adSlot?.type ?? ''}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select type...
            </option>
            {AD_SLOT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.type?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.type[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="basePrice" className="mb-1 block text-sm font-medium">
            Base Price ($/mo)
          </label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            required
            min="0.01"
            step="0.01"
            defaultValue={adSlot ? Number(adSlot.basePrice) : ''}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.basePrice?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.basePrice[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className="mb-1 block text-sm font-medium">
            Width (px)
            <span className="ml-1 font-normal text-[--color-muted]">optional</span>
          </label>
          <input
            id="width"
            name="width"
            type="number"
            min="1"
            step="1"
            defaultValue={adSlot?.width ?? ''}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.width?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.width[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="height" className="mb-1 block text-sm font-medium">
            Height (px)
            <span className="ml-1 font-normal text-[--color-muted]">optional</span>
          </label>
          <input
            id="height"
            name="height"
            type="number"
            min="1"
            step="1"
            defaultValue={adSlot?.height ?? ''}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.height?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.height[0]}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[--color-border] px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <SubmitButton pendingText={isEdit ? 'Saving...' : 'Creating...'}>
          {isEdit ? 'Save Changes' : 'Create Ad Slot'}
        </SubmitButton>
      </div>
    </form>
  );
}
