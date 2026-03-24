import 'server-only';

import { ActionRateLimitError } from '@/lib/rate-limit/errors';
import {
  createRateLimitErrorResponse,
  enforceRequestRateLimit,
} from '@/lib/rate-limit/request-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;

type AuthRouteRateLimitPolicy = {
  actor: 'authenticated_or_ip' | 'ip_only';
  limit: number;
  scope: string;
  windowMs: number;
};

function getAuthRoutePathname(request: Request): string {
  const url = new URL(request.url);
  return url.pathname.replace(/\/+$/, '');
}

export function resolveAuthRouteRateLimitPolicy(request: Request): AuthRouteRateLimitPolicy {
  const pathname = getAuthRoutePathname(request);

  if (request.method === 'GET') {
    return {
      actor: 'authenticated_or_ip',
      limit: 120,
      scope: 'auth:get',
      windowMs: WINDOW_MS,
    };
  }

  if (/\/(sign-in|sign-up)(\/|$)/.test(pathname)) {
    return {
      actor: 'ip_only',
      limit: 10,
      scope: 'auth:credential-entry',
      windowMs: WINDOW_MS,
    };
  }

  if (
    /\/(forget-password|reset-password|change-password|send-verification-email|verify-email)(\/|$)/.test(
      pathname
    )
  ) {
    return {
      actor: 'ip_only',
      limit: 10,
      scope: 'auth:recovery',
      windowMs: WINDOW_MS,
    };
  }

  if (/\/sign-out(\/|$)/.test(pathname)) {
    return {
      actor: 'authenticated_or_ip',
      limit: 30,
      scope: 'auth:sign-out',
      windowMs: WINDOW_MS,
    };
  }

  return {
    actor: 'authenticated_or_ip',
    limit: 60,
    scope: 'auth:mutation',
    windowMs: WINDOW_MS,
  };
}

export async function applyAuthRouteRateLimit(request: Request): Promise<Response | null> {
  const policy = resolveAuthRouteRateLimitPolicy(request);

  try {
    await enforceRequestRateLimit({
      actor: policy.actor,
      limit: policy.limit,
      request,
      scope: policy.scope,
      windowMs: policy.windowMs,
    });

    return null;
  } catch (error) {
    if (error instanceof ActionRateLimitError) {
      return createRateLimitErrorResponse(error);
    }

    throw error;
  }
}
