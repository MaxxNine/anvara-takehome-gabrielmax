'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';

export async function deleteAdSlotAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Ad slot ID is required' };

  try {
    const requestHeaders = await headers();
    await serverApi(`/api/ad-slots/${id}`, {
      method: 'DELETE',
      requestHeaders,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete ad slot',
    };
  }

  revalidatePath('/dashboard/publisher');
  return { success: true };
}
