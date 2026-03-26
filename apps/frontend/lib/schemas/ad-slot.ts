import { z } from 'zod';

const AD_SLOT_TYPES = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'] as const;

const optionalPositiveInt = z.union([
  z.literal(''),
  z.coerce.number().int('Must be a whole number').positive('Must be a positive integer'),
]);

export const adSlotSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  type: z.enum(AD_SLOT_TYPES, { error: 'Please select a valid ad slot type' }),
  basePrice: z.coerce.number().positive('Base price must be a positive number'),
  width: optionalPositiveInt,
  height: optionalPositiveInt,
});

export const updateAdSlotSchema = z.object({
  id: z.string().min(1, 'Ad slot ID is required'),
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  type: z.enum(AD_SLOT_TYPES, { error: 'Please select a valid ad slot type' }),
  basePrice: z.coerce.number().positive('Base price must be a positive number'),
  width: optionalPositiveInt,
  height: optionalPositiveInt,
});
