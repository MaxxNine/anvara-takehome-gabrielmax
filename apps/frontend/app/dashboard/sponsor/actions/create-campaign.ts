'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';
import { campaignSchema } from '@/lib/schemas/campaign';
import { extractFieldValues, validationError } from '@/lib/schemas/utils';

const FIELD_KEYS = ['name', 'description', 'budget', 'startDate', 'endDate', 'cpmRate', 'cpcRate'];

export async function createCampaignAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fieldValues = extractFieldValues(formData, FIELD_KEYS);
  const raw = Object.fromEntries(formData);
  const result = campaignSchema.safeParse(raw);

  if (!result.success) {
    return validationError(result.error.flatten().fieldErrors, fieldValues);
  }

  const { name, description, budget, startDate, endDate, cpmRate, cpcRate } = result.data;

  const data: Record<string, unknown> = { name, budget, startDate, endDate };
  if (description) data.description = description;
  if (typeof cpmRate === 'number') data.cpmRate = cpmRate;
  if (typeof cpcRate === 'number') data.cpcRate = cpcRate;

  try {
    const requestHeaders = await headers();
    await serverApi('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      requestHeaders,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create campaign',
      fieldValues,
    };
  }

  revalidatePath('/dashboard/sponsor');
  return { success: true };
}
