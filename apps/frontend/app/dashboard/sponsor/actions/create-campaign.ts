'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';

export async function createCampaignAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const budget = formData.get('budget') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const cpmRate = formData.get('cpmRate') as string;
  const cpcRate = formData.get('cpcRate') as string;

  const fieldValues = {
    name: name ?? '',
    description: description ?? '',
    budget: budget ?? '',
    startDate: startDate ?? '',
    endDate: endDate ?? '',
    cpmRate: cpmRate ?? '',
    cpcRate: cpcRate ?? '',
  };

  const fieldErrors: Record<string, string[]> = {};
  if (!name?.trim()) fieldErrors.name = ['Name is required'];
  if (!budget || Number(budget) <= 0) fieldErrors.budget = ['Budget must be a positive number'];
  if (!startDate) fieldErrors.startDate = ['Start date is required'];
  if (!endDate) fieldErrors.endDate = ['End date is required'];
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    fieldErrors.endDate = ['End date must be on or after start date'];
  }
  if (cpmRate && Number(cpmRate) <= 0) fieldErrors.cpmRate = ['CPM rate must be positive'];
  if (cpcRate && Number(cpcRate) <= 0) fieldErrors.cpcRate = ['CPC rate must be positive'];

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors, fieldValues };
  }

  const data: Record<string, unknown> = {
    name: name.trim(),
    budget: Number(budget),
    startDate,
    endDate,
  };
  if (description?.trim()) data.description = description.trim();
  if (cpmRate) data.cpmRate = Number(cpmRate);
  if (cpcRate) data.cpcRate = Number(cpcRate);

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
