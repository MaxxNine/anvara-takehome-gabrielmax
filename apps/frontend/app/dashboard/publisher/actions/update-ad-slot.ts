'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';
import { updateAdSlotSchema } from '@/lib/schemas/ad-slot';
import { extractFieldValues, validationError } from '@/lib/schemas/utils';

const FIELD_KEYS = ['name', 'description', 'type', 'basePrice', 'width', 'height'];

export async function updateAdSlotAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fieldValues = extractFieldValues(formData, FIELD_KEYS);
  const raw = Object.fromEntries(formData);
  const result = updateAdSlotSchema.safeParse(raw);

  if (!result.success) {
    return validationError(result.error.flatten().fieldErrors, fieldValues);
  }

  const { id, name, description, type, basePrice, width, height } = result.data;

  const data: Record<string, unknown> = {
    name,
    description: description || null,
    type,
    basePrice,
    width: typeof width === 'number' ? width : null,
    height: typeof height === 'number' ? height : null,
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
      fieldValues,
    };
  }

  revalidatePath('/dashboard/publisher');
  return { success: true };
}
