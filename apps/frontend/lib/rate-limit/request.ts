import 'server-only';

import { auth } from '@/auth';
import type { ForwardedRequestHeaders } from '@/lib/server-api';

const RATE_LIMIT_RESPONSE = { error: 'Too many requests, please try again later' };

export function getClientIpAddress(requestHeaders?: ForwardedRequestHeaders): string {
  const headers = new Headers(requestHeaders);
  const forwardedFor = headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return headers.get('x-real-ip') || 'unknown';
}

export async function resolveAuthenticatedActorKey(
  requestHeaders?: ForwardedRequestHeaders
): Promise<string> {
  if (requestHeaders) {
    try {
      const session = await auth.api.getSession({
        headers: requestHeaders,
      });

      if (session?.user?.id) {
        return `user:${session.user.id}`;
      }
    } catch {
      // Fall back to client IP when auth session resolution is unavailable.
    }
  }

  return `ip:${getClientIpAddress(requestHeaders)}`;
}

export function createRateLimitResponse(retryAfterSeconds: number): Response {
  return Response.json(RATE_LIMIT_RESPONSE, {
    status: 429,
    headers: {
      'Retry-After': retryAfterSeconds.toString(),
    },
  });
}
