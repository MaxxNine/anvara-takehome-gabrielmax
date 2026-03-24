'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { serverApi } from '@/lib/server-api';
import type { ActionState } from '@/lib/action-types';
import { handleActionError } from '@/lib/action-helpers';
import { adSlotSchema } from '@/lib/schemas/ad-slot';
import { extractFieldValues, validationError } from '@/lib/schemas/utils';

const FIELD_KEYS = ['name', 'description', 'type', 'basePrice', 'width', 'height'];

export async function createAdSlotAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fieldValues = extractFieldValues(formData, FIELD_KEYS);
  const result = adSlotSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return validationError(result.error.flatten().fieldErrors, fieldValues);
  }

  const { name, description, type, basePrice, width, height } = result.data;

  const data: Record<string, unknown> = { name, type, basePrice };
  if (description) data.description = description;
  if (typeof width === 'number') data.width = width;
  if (typeof height === 'number') data.height = height;

  try {
    const requestHeaders = await headers();
    await serverApi('/api/ad-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      requestHeaders,
    });
  } catch (error) {
    return handleActionError(error, 'Failed to create ad slot', fieldValues);
  }

  revalidatePath('/dashboard/publisher');
  return { success: true };
}
