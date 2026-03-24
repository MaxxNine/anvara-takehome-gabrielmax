'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import type { ActionState } from '@/lib/action-types';
import { handleActionError } from '@/lib/action-helpers';
import { serverApi } from '@/lib/server-api';
import { extractFieldValues, validationError } from '@/lib/schemas/utils';

const FIELD_KEYS = ['adSlotId', 'message'];

const bookPlacementSchema = z.object({
  adSlotId: z.string().min(1, 'Ad slot is required'),
  message: z
    .string()
    .trim()
    .max(500, 'Message must be 500 characters or fewer')
    .optional()
    .or(z.literal('')),
});

export async function bookPlacementAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fieldValues = extractFieldValues(formData, FIELD_KEYS);
  const result = bookPlacementSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return validationError(result.error.flatten().fieldErrors, fieldValues);
  }

  const { adSlotId, message } = result.data;

  try {
    const requestHeaders = await headers();
    await serverApi(`/api/ad-slots/${adSlotId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message ? { message } : {}),
      requestHeaders,
    });
  } catch (error) {
    return handleActionError(error, 'Failed to book placement', fieldValues);
  }

  revalidatePath('/marketplace');
  revalidatePath(`/marketplace/${adSlotId}`);

  return { success: true };
}
