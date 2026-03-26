'use client';

import { useActionState, useState } from 'react';

import type { Campaign } from '@/lib/types';
import { initialActionState } from '@/lib/action-types';
import { FormModal } from '@/app/components/form-modal';
import { SubmitButton } from '@/app/components/submit-button';
import { deleteCampaignAction } from '../actions/delete-campaign';
import { CampaignForm } from './campaign-form';

type CampaignCardProps = {
  campaign: Campaign;
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  PENDING_REVIEW: 'bg-purple-100 text-purple-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteState, deleteAction] = useActionState(deleteCampaignAction, initialActionState);

  const budget = Number(campaign.budget);
  const spent = Number(campaign.spent);
  const progress = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <>
      <div className="rounded-lg border border-[--color-border] p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold">{campaign.name}</h3>
          <span
            className={`rounded px-2 py-0.5 text-xs ${statusColors[campaign.status] || 'bg-gray-100'}`}
          >
            {campaign.status.replace(/_/g, ' ')}
          </span>
        </div>

        {campaign.description && (
          <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{campaign.description}</p>
        )}

        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-[--color-muted]">Budget</span>
            <span>
              ${spent.toLocaleString()} / ${budget.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-[--color-primary]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="mb-3 text-xs text-[--color-muted]">
          {new Date(campaign.startDate).toLocaleDateString()} -{' '}
          {new Date(campaign.endDate).toLocaleDateString()}
        </div>

        {deleteState.error && (
          <p className="mb-2 text-sm text-red-600">{deleteState.error}</p>
        )}

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600">Delete this campaign?</span>
            <form action={deleteAction} className="inline">
              <input type="hidden" name="id" value={campaign.id} />
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
          title="Edit Campaign"
          description={`Editing "${campaign.name}"`}
        >
          <CampaignForm campaign={campaign} onClose={() => setEditOpen(false)} />
        </FormModal>
      )}
    </>
  );
}
