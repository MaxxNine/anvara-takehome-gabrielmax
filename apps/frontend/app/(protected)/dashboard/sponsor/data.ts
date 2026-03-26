import 'server-only';

import type { Campaign } from '@/lib/types';
import { serverApi, type ForwardedRequestHeaders } from '@/lib/server-api';

export async function getSponsorCampaigns(
  requestHeaders?: ForwardedRequestHeaders
): Promise<Campaign[]> {
  return serverApi<Campaign[]>('/api/campaigns', {
    cache: 'no-store',
    requestHeaders,
  });
}
