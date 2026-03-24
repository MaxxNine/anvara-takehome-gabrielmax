import 'server-only';

import type { AdSlot } from '@/lib/types';
import { serverApi, type ForwardedRequestHeaders } from '@/lib/server-api';

export async function getMarketplaceAdSlots(
  requestHeaders?: ForwardedRequestHeaders
): Promise<AdSlot[]> {
  return serverApi<AdSlot[]>('/api/ad-slots', {
    cache: 'no-store',
    requestHeaders,
  });
}
