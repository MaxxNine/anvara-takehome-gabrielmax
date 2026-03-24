'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';
import { handleActionError } from '@/lib/action-helpers';
import { updateCampaignSchema } from '@/lib/schemas/campaign';
import { extractFieldValues, validationError } from '@/lib/schemas/utils';

const FIELD_KEYS = ['name', 'description', 'budget', 'startDate', 'endDate', 'cpmRate', 'cpcRate', 'status'];

export async function updateCampaignAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fieldValues = extractFieldValues(formData, FIELD_KEYS);
  const result = updateCampaignSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return validationError(result.error.flatten().fieldErrors, fieldValues);
  }

  const { id, name, description, budget, startDate, endDate, cpmRate, cpcRate, status } = result.data;

  const data: Record<string, unknown> = {
    name,
    description: description || null,
    budget,
    startDate,
    endDate,
    cpmRate: typeof cpmRate === 'number' ? cpmRate : null,
    cpcRate: typeof cpcRate === 'number' ? cpcRate : null,
  };
  if (status) data.status = status;

  try {
    const requestHeaders = await headers();
    await serverApi(`/api/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      requestHeaders,
    });
  } catch (error) {
    return handleActionError(error, 'Failed to update campaign', fieldValues);
  }

  revalidatePath('/dashboard/sponsor');
  return { success: true };
}
