'use client';

import { useState } from 'react';

import { FormModal } from '@/app/components/form-modal';
import { AdSlotForm } from './ad-slot-form';

export function CreateAdSlotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:bg-indigo-600"
      >
        Create Ad Slot
      </button>

      {open && (
        <FormModal
          open={open}
          onClose={() => setOpen(false)}
          title="Create Ad Slot"
          description="Fill in the details to create a new ad slot."
        >
          <AdSlotForm onClose={() => setOpen(false)} />
        </FormModal>
      )}
    </>
  );
}
