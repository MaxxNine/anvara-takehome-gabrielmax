import 'server-only';

import { serverApi, type ForwardedRequestHeaders } from './server-api';

export type UserRole = 'sponsor' | 'publisher' | null;

export interface RoleData {
  role: UserRole;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

/**
 * Fetch user role from the backend based on userId.
 * Forwarding request headers keeps this helper compatible with future
 * backend auth middleware that expects session cookies or auth headers.
 */
export async function getUserRole(
  userId: string,
  requestHeaders?: ForwardedRequestHeaders
): Promise<RoleData> {
  return serverApi<RoleData>(`/api/auth/role/${userId}`, {
    cache: 'no-store',
    requestHeaders,
  });
}
