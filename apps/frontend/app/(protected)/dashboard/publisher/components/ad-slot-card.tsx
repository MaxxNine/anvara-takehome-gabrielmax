'use client';

import { useActionState, useState } from 'react';

import type { AdSlot } from '@/lib/types';
import { initialActionState } from '@/lib/action-types';
import { FormModal } from '@/app/components/form-modal';
import { SubmitButton } from '@/app/components/submit-button';
import { deleteAdSlotAction } from '../actions/delete-ad-slot';
import { AdSlotForm } from './ad-slot-form';

type AdSlotCardProps = {
  adSlot: AdSlot;
};

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NATIVE: 'bg-green-100 text-green-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteState, deleteAction] = useActionState(deleteAdSlotAction, initialActionState);

  return (
    <>
      <div className="rounded-lg border border-[--color-border] p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold">{adSlot.name}</h3>
          <span
            className={`rounded px-2 py-0.5 text-xs ${typeColors[adSlot.type] || 'bg-gray-100'}`}
          >
            {adSlot.type}
          </span>
        </div>

        {adSlot.description && (
          <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{adSlot.description}</p>
        )}

        <div className="mb-3 flex items-center justify-between">
          <span
            className={`text-sm ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
          >
            {adSlot.isAvailable ? 'Available' : 'Booked'}
          </span>
          <span className="font-semibold text-indigo-500">
            ${Number(adSlot.basePrice).toLocaleString()}/mo
          </span>
        </div>

        {adSlot.width && adSlot.height && (
          <p className="mb-3 text-xs text-[--color-muted]">
            {adSlot.width} x {adSlot.height}px
          </p>
        )}

        {deleteState.error && (
          <p className="mb-2 text-sm text-red-600">{deleteState.error}</p>
        )}

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600">Delete this ad slot?</span>
            <form action={deleteAction} className="inline">
              <input type="hidden" name="id" value={adSlot.id} />
              <SubmitButton
                variant="danger"
                pendingText="Deleting..."
                className="px-3 py-1 text-xs"
              >
                Confirm
              </SubmitButton>
            </form>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded border border-[--color-border] px-3 py-1 text-xs transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="rounded border border-[--color-border] px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {editOpen && (
        <FormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit Ad Slot"
          description={`Editing "${adSlot.name}"`}
        >
          <AdSlotForm adSlot={adSlot} onClose={() => setEditOpen(false)} />
        </FormModal>
      )}
    </>
  );
}
