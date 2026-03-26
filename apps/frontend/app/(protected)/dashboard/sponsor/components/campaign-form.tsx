'use client';

import { useActionState, useEffect } from 'react';

import { ActionErrorNotice } from '@/app/components/action-error-notice';
import { useTrackActionFormEvents } from '@/lib/analytics';
import { initialActionState } from '@/lib/action-types';
import { SubmitButton } from '@/app/components/submit-button';
import type { Campaign, CampaignStatus } from '@/lib/types';
import { createCampaignAction } from '../actions/create-campaign';
import { updateCampaignAction } from '../actions/update-campaign';

type CampaignFormProps = {
  campaign?: Campaign;
  onClose: () => void;
};

const CAMPAIGN_STATUSES: CampaignStatus[] = [
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
];

function toDateInputValue(dateString: string): string {
  return dateString.slice(0, 10);
}

export function CampaignForm({ campaign, onClose }: CampaignFormProps) {
  const isEdit = !!campaign;
  const action = isEdit ? updateCampaignAction : createCampaignAction;
  const [state, formAction] = useActionState(action, initialActionState);
  const trackSubmit = useTrackActionFormEvents(
    isEdit ? 'sponsor_campaign_edit' : 'sponsor_campaign_create',
    state
  );

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} onSubmit={trackSubmit} className="space-y-4">
      <ActionErrorNotice state={state} />

      {isEdit && <input type="hidden" name="id" value={campaign.id} />}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={state.fieldValues?.name ?? campaign?.name ?? ''}
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
          defaultValue={state.fieldValues?.description ?? campaign?.description ?? ''}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="budget" className="mb-1 block text-sm font-medium">
          Budget ($)
        </label>
        <input
          id="budget"
          name="budget"
          type="number"
          required
          min="0.01"
          step="0.01"
          defaultValue={state.fieldValues?.budget ?? (campaign ? Number(campaign.budget) : '')}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
        />
        {state.fieldErrors?.budget?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.budget[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="mb-1 block text-sm font-medium">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            defaultValue={state.fieldValues?.startDate ?? (campaign ? toDateInputValue(campaign.startDate) : '')}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.startDate?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.startDate[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="mb-1 block text-sm font-medium">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            defaultValue={state.fieldValues?.endDate ?? (campaign ? toDateInputValue(campaign.endDate) : '')}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.endDate?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.endDate[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cpmRate" className="mb-1 block text-sm font-medium">
            CPM Rate ($)
            <span className="ml-1 font-normal text-[--color-muted]">optional</span>
          </label>
          <input
            id="cpmRate"
            name="cpmRate"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={state.fieldValues?.cpmRate ?? (campaign?.cpmRate != null ? Number(campaign.cpmRate) : '')}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.cpmRate?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.cpmRate[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="cpcRate" className="mb-1 block text-sm font-medium">
            CPC Rate ($)
            <span className="ml-1 font-normal text-[--color-muted]">optional</span>
          </label>
          <input
            id="cpcRate"
            name="cpcRate"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={state.fieldValues?.cpcRate ?? (campaign?.cpcRate != null ? Number(campaign.cpcRate) : '')}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.cpcRate?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.cpcRate[0]}</p>
          )}
        </div>
      </div>

      {isEdit && (
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={state.fieldValues?.status ?? campaign.status}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
          >
            {CAMPAIGN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          {state.fieldErrors?.status?.[0] && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.status[0]}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[--color-border] px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <SubmitButton pendingText={isEdit ? 'Saving...' : 'Creating...'}>
          {isEdit ? 'Save Changes' : 'Create Campaign'}
        </SubmitButton>
      </div>
    </form>
  );
}
