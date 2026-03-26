import 'server-only';

import type { ForwardedRequestHeaders } from '@/lib/server-api';
import { enforceRateLimitKey } from './core';
import { resolveAuthenticatedActorKey } from './request';

type EnforceActionRateLimitOptions = {
  limit: number;
  requestHeaders?: ForwardedRequestHeaders;
  scope: string;
  windowMs: number;
};
const DEFAULT_RATE_LIMIT_PREFIX = 'anvara:rate-limit:server-action:';

export async function enforceActionRateLimit({
  limit,
  requestHeaders,
  scope,
  windowMs,
}: EnforceActionRateLimitOptions): Promise<void> {
  const actorKey = await resolveAuthenticatedActorKey(requestHeaders);

  await enforceRateLimitKey({
    key: `${DEFAULT_RATE_LIMIT_PREFIX}${scope}:${actorKey}`,
    limit,
    windowMs,
  });
}
