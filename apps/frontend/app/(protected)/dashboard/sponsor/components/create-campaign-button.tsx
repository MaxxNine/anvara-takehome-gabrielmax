'use client';

import { useState } from 'react';

import { FormModal } from '@/app/components/form-modal';
import { CampaignForm } from './campaign-form';

export function CreateCampaignButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:bg-indigo-600"
      >
        Create Campaign
      </button>

      {open && (
        <FormModal
          open={open}
          onClose={() => setOpen(false)}
          title="Create Campaign"
          description="Fill in the details to create a new campaign."
        >
          <CampaignForm onClose={() => setOpen(false)} />
        </FormModal>
      )}
    </>
  );
}
