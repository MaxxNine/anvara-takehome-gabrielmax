'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';
import { handleActionError } from '@/lib/action-helpers';

export async function deleteCampaignAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Campaign ID is required' };

  try {
    const requestHeaders = await headers();
    await serverApi(`/api/campaigns/${id}`, {
      method: 'DELETE',
      requestHeaders,
    });
  } catch (error) {
    return handleActionError(error, 'Failed to delete campaign');
  }

  revalidatePath('/dashboard/sponsor');
  return { success: true };
}
