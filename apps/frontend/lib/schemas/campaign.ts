import { z } from 'zod';

const CAMPAIGN_STATUSES = [
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
] as const;

export const campaignSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().optional(),
    budget: z.coerce.number().positive('Budget must be a positive number'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    cpmRate: z.union([z.literal(''), z.coerce.number().positive('CPM rate must be positive')]),
    cpcRate: z.union([z.literal(''), z.coerce.number().positive('CPC rate must be positive')]),
  })
  .refine((data) => !data.startDate || !data.endDate || new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const updateCampaignSchema = z
  .object({
    id: z.string().min(1, 'Campaign ID is required'),
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().optional(),
    budget: z.coerce.number().positive('Budget must be a positive number'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    cpmRate: z.union([z.literal(''), z.coerce.number().positive('CPM rate must be positive')]),
    cpcRate: z.union([z.literal(''), z.coerce.number().positive('CPC rate must be positive')]),
    status: z.enum(CAMPAIGN_STATUSES).optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });
