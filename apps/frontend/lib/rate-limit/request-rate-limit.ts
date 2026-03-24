import 'server-only';

import { ActionRateLimitError } from './errors';
import { enforceRateLimitKey } from './core';
import { createRateLimitResponse, getClientIpAddress, resolveAuthenticatedActorKey } from './request';

const DEFAULT_ROUTE_RATE_LIMIT_PREFIX = 'anvara:rate-limit:route:';

type EnforceRequestRateLimitOptions = {
  actor: 'authenticated_or_ip' | 'ip_only';
  limit: number;
  request: Request;
  scope: string;
  windowMs: number;
};

async function resolveRequestActorKey(
  request: Request,
  actor: EnforceRequestRateLimitOptions['actor']
): Promise<string> {
  if (actor === 'ip_only') {
    return `ip:${getClientIpAddress(request.headers)}`;
  }

  return resolveAuthenticatedActorKey(request.headers);
}

export async function enforceRequestRateLimit({
  actor,
  limit,
  request,
  scope,
  windowMs,
}: EnforceRequestRateLimitOptions): Promise<void> {
  const actorKey = await resolveRequestActorKey(request, actor);

  await enforceRateLimitKey({
    key: `${DEFAULT_ROUTE_RATE_LIMIT_PREFIX}${scope}:${actorKey}`,
    limit,
    windowMs,
  });
}

export function createRateLimitErrorResponse(error: ActionRateLimitError): Response {
  return createRateLimitResponse(error.retryAfterSeconds);
}
