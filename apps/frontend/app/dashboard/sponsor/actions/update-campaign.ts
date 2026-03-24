'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';
import { updateCampaignSchema } from '@/lib/schemas/campaign';
import { extractFieldValues, validationError } from '@/lib/schemas/utils';

const FIELD_KEYS = ['name', 'description', 'budget', 'startDate', 'endDate', 'cpmRate', 'cpcRate', 'status'];

export async function updateCampaignAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fieldValues = extractFieldValues(formData, FIELD_KEYS);
  const raw = Object.fromEntries(formData);
  const result = updateCampaignSchema.safeParse(raw);

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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update campaign',
      fieldValues,
    };
  }

  revalidatePath('/dashboard/sponsor');
  return { success: true };
}
