import 'server-only';

import { auth } from '@/auth';
import { getCurrentUserProfile } from '@/lib/auth-helpers';
import { ApiError, serverApi, type ForwardedRequestHeaders } from '@/lib/server-api';
import type { AdSlot, RoleInfo, SessionUser } from '@/lib/types';
import { getMarketplaceAdSlots } from '../data';

export type MarketplaceViewer = {
  roleInfo: RoleInfo | null;
  user: SessionUser | null;
};

export async function getMarketplaceAdSlot(
  id: string,
  requestHeaders?: ForwardedRequestHeaders
): Promise<AdSlot | null> {
  try {
    return await serverApi<AdSlot>(`/api/ad-slots/${id}`, {
      cache: 'no-store',
      requestHeaders,
    });
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) {
      return null;
    }

    throw error;
  }
}

export async function getMarketplaceViewer(
  requestHeaders: HeadersInit
): Promise<MarketplaceViewer> {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return { user: null, roleInfo: null };
  }

  const user: SessionUser = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email ?? '',
  };

  try {
    const roleInfo = await getCurrentUserProfile(requestHeaders);

    return {
      user,
      roleInfo,
    };
  } catch {
    return {
      user,
      roleInfo: null,
    };
  }
}

export async function getRelatedMarketplaceAdSlots(
  currentSlotId: string,
  requestHeaders?: ForwardedRequestHeaders
): Promise<AdSlot[]> {
  const adSlots = await getMarketplaceAdSlots(requestHeaders);

  return adSlots.filter((slot) => slot.isAvailable && slot.id !== currentSlotId).slice(0, 3);
}
