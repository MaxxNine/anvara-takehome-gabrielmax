'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import type { ActionState } from '@/lib/action-types';
import { handleActionError } from '@/lib/action-helpers';
import { enforceActionRateLimit } from '@/lib/rate-limit/server-action-rate-limit';
import { serverApi } from '@/lib/server-api';
import { extractFieldValues, validationError } from '@/lib/schemas/utils';

const FIELD_KEYS = ['adSlotId'];
const RESET_LISTING_RATE_LIMIT = {
  limit: 15,
  scope: 'marketplace:reset-listing',
  windowMs: 15 * 60 * 1000,
} as const;

const resetListingSchema = z.object({
  adSlotId: z.string().min(1, 'Ad slot is required'),
});

export async function resetListingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fieldValues = extractFieldValues(formData, FIELD_KEYS);
  const result = resetListingSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return validationError(result.error.flatten().fieldErrors, fieldValues);
  }

  const { adSlotId } = result.data;

  try {
    const requestHeaders = await headers();
    await enforceActionRateLimit({
      ...RESET_LISTING_RATE_LIMIT,
      requestHeaders,
    });

    await serverApi(`/api/ad-slots/${adSlotId}/unbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      requestHeaders,
    });
  } catch (error) {
    return handleActionError(error, 'Failed to reset listing', fieldValues);
  }

  revalidatePath('/marketplace');
  revalidatePath(`/marketplace/${adSlotId}`);

  return { success: true };
}
