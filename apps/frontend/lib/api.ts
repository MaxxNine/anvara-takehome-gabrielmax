import { mutationOptions, queryOptions } from '@tanstack/react-query';

import type {
  AdSlot,
  Campaign,
  CreateAdSlotInput,
  CreateCampaignInput,
  CreatePlacementInput,
  DashboardStats,
  Placement,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export type NewsletterSubscribeResponse = {
  error?: string;
  message?: string;
  success?: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'API request failed';
  }

  const { error, message } = payload as ApiErrorPayload;
  return error ?? message ?? 'API request failed';
}

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);

  if (!(options?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson
    ? await res.json()
    : res.status === 204
      ? null
      : await res.text();

  if (!res.ok) {
    throw new ApiError(getErrorMessage(payload), res.status, payload);
  }

  return payload as T;
}

export const apiQueryKeys = {
  adSlot: (id: string) => ['ad-slots', id] as const,
  adSlots: (publisherId?: string) => ['ad-slots', { publisherId: publisherId ?? null }] as const,
  campaign: (id: string) => ['campaigns', id] as const,
  campaigns: (sponsorId?: string) => ['campaigns', { sponsorId: sponsorId ?? null }] as const,
  dashboardStats: () => ['dashboard', 'stats'] as const,
  placements: () => ['placements'] as const,
};

// Campaigns
export const getCampaigns = (sponsorId?: string) =>
  api<Campaign[]>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');

export const getCampaign = (id: string) => api<Campaign>(`/api/campaigns/${id}`);

export const createCampaign = (data: CreateCampaignInput) =>
  api('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });

export const campaignsQueryOptions = (sponsorId?: string) =>
  queryOptions({
    queryFn: () => getCampaigns(sponsorId),
    queryKey: apiQueryKeys.campaigns(sponsorId),
  });

export const campaignQueryOptions = (id: string) =>
  queryOptions({
    queryFn: () => getCampaign(id),
    queryKey: apiQueryKeys.campaign(id),
  });

export const createCampaignMutationOptions = () =>
  mutationOptions({
    mutationFn: createCampaign,
    mutationKey: ['campaigns', 'create'] as const,
  });

// Ad Slots
export const getAdSlots = (publisherId?: string) =>
  api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');

export const getAdSlot = (id: string) => api<AdSlot>(`/api/ad-slots/${id}`);

export const createAdSlot = (data: CreateAdSlotInput) =>
  api('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });

export const adSlotsQueryOptions = (publisherId?: string) =>
  queryOptions({
    queryFn: () => getAdSlots(publisherId),
    queryKey: apiQueryKeys.adSlots(publisherId),
  });

export const adSlotQueryOptions = (id: string) =>
  queryOptions({
    queryFn: () => getAdSlot(id),
    queryKey: apiQueryKeys.adSlot(id),
  });

export const createAdSlotMutationOptions = () =>
  mutationOptions({
    mutationFn: createAdSlot,
    mutationKey: ['ad-slots', 'create'] as const,
  });

// Placements
export const getPlacements = () => api<Placement[]>('/api/placements');

export const createPlacement = (data: CreatePlacementInput) =>
  api('/api/placements', { method: 'POST', body: JSON.stringify(data) });

export const placementsQueryOptions = () =>
  queryOptions({
    queryFn: getPlacements,
    queryKey: apiQueryKeys.placements(),
  });

export const createPlacementMutationOptions = () =>
  mutationOptions({
    mutationFn: createPlacement,
    mutationKey: ['placements', 'create'] as const,
  });

// Dashboard
export const getStats = () => api<DashboardStats>('/api/dashboard/stats');

export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryFn: getStats,
    queryKey: apiQueryKeys.dashboardStats(),
  });

// Newsletter
export const subscribeToNewsletter = (email: string) =>
  api<NewsletterSubscribeResponse>('/api/newsletter/subscribe', {
    body: JSON.stringify({ email }),
    method: 'POST',
  });

export const newsletterSubscribeMutationOptions = () =>
  mutationOptions({
    mutationFn: subscribeToNewsletter,
    mutationKey: ['newsletter', 'subscribe'] as const,
  });
