import 'server-only';

import { ActionRateLimitError } from '@/lib/rate-limit/errors';
import {
  createRateLimitErrorResponse,
  enforceRequestRateLimit,
} from '@/lib/rate-limit/request-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;

function isLocalRuntime(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
}

function resolveLimit(envKey: string, productionDefault: number, localDefault: number): number {
  const envValue = process.env[envKey];
  const parsedValue = envValue ? Number.parseInt(envValue, 10) : Number.NaN;

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return isLocalRuntime() ? localDefault : productionDefault;
}

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
      limit: resolveLimit('FRONTEND_AUTH_GET_RATE_LIMIT', 120, 300),
      scope: 'auth:get',
      windowMs: WINDOW_MS,
    };
  }

  if (/\/(sign-in|sign-up)(\/|$)/.test(pathname)) {
    return {
      actor: 'ip_only',
      limit: resolveLimit('FRONTEND_AUTH_CREDENTIAL_RATE_LIMIT', 10, 50),
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
      limit: resolveLimit('FRONTEND_AUTH_RECOVERY_RATE_LIMIT', 10, 30),
      scope: 'auth:recovery',
      windowMs: WINDOW_MS,
    };
  }

  if (/\/sign-out(\/|$)/.test(pathname)) {
    return {
      actor: 'authenticated_or_ip',
      limit: resolveLimit('FRONTEND_AUTH_SIGN_OUT_RATE_LIMIT', 30, 90),
      scope: 'auth:sign-out',
      windowMs: WINDOW_MS,
    };
  }

  return {
    actor: 'authenticated_or_ip',
    limit: resolveLimit('FRONTEND_AUTH_MUTATION_RATE_LIMIT', 60, 180),
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
