import 'server-only';

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
