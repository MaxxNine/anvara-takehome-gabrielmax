'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';
import type { AdSlotType } from '@/lib/types';

const VALID_AD_SLOT_TYPES: AdSlotType[] = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];

export async function updateAdSlotAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  if (!id) return { success: false, error: 'Ad slot ID is required' };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const basePrice = formData.get('basePrice') as string;
  const width = formData.get('width') as string;
  const height = formData.get('height') as string;

  const fieldErrors: Record<string, string[]> = {};
  if (!name?.trim()) fieldErrors.name = ['Name is required'];
  if (!type || !VALID_AD_SLOT_TYPES.includes(type as AdSlotType)) {
    fieldErrors.type = ['Please select a valid ad slot type'];
  }
  if (!basePrice || Number(basePrice) <= 0) {
    fieldErrors.basePrice = ['Base price must be a positive number'];
  }
  if (width && (!Number.isInteger(Number(width)) || Number(width) <= 0)) {
    fieldErrors.width = ['Width must be a positive integer'];
  }
  if (height && (!Number.isInteger(Number(height)) || Number(height) <= 0)) {
    fieldErrors.height = ['Height must be a positive integer'];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  const data: Record<string, unknown> = {
    name: name.trim(),
    description: description?.trim() || null,
    type,
    basePrice: Number(basePrice),
    width: width ? Number(width) : null,
    height: height ? Number(height) : null,
  };

  try {
    const requestHeaders = await headers();
    await serverApi(`/api/ad-slots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      requestHeaders,
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update ad slot',
    };
  }

  revalidatePath('/dashboard/publisher');
  return { success: true };
}
