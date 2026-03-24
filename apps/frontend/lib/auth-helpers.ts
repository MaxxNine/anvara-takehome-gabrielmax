import 'server-only';

import { auth } from '@/auth';
import type { RoleInfo } from './types';
import { serverApi, type ForwardedRequestHeaders } from './server-api';

/**
 * Fetch the authenticated user's frontend bootstrap profile from the backend.
 * Forwarding request headers keeps this helper compatible with backend
 * auth middleware that expects session cookies or auth headers.
 */
export async function getCurrentUserProfile(
  requestHeaders?: ForwardedRequestHeaders
): Promise<RoleInfo> {
  return serverApi<RoleInfo>('/api/auth/profile', {
    cache: 'no-store',
    requestHeaders,
  });
}

export async function getPostLoginRedirectPath(
  requestHeaders: HeadersInit
): Promise<string> {
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return '/';
  }

  try {
    const profile = await getCurrentUserProfile(requestHeaders);

    if (profile.role === 'sponsor') {
      return '/dashboard/sponsor';
    }

    if (profile.role === 'publisher') {
      return '/dashboard/publisher';
    }
  } catch {
    return '/';
  }

  return '/';
}
