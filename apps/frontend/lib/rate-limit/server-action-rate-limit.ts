import 'server-only';

import { auth } from '@/auth';
import type { ForwardedRequestHeaders } from '@/lib/server-api';
import { ActionRateLimitError } from './errors';
import { getRateLimitRedisClient } from './redis';

const DEFAULT_RATE_LIMIT_PREFIX = 'anvara:rate-limit:server-action:';
const fallbackCounters = new Map<string, { count: number; resetAt: number }>();

type EnforceActionRateLimitOptions = {
  limit: number;
  requestHeaders?: ForwardedRequestHeaders;
  scope: string;
  windowMs: number;
};

function getClientIpAddress(requestHeaders?: ForwardedRequestHeaders): string {
  const headers = new Headers(requestHeaders);
  const forwardedFor = headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return headers.get('x-real-ip') || 'unknown';
}

async function resolveActorKey(requestHeaders?: ForwardedRequestHeaders): Promise<string> {
  if (requestHeaders) {
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (session?.user?.id) {
      return `user:${session.user.id}`;
    }
  }

  return `ip:${getClientIpAddress(requestHeaders)}`;
}

function consumeFallbackRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const currentEntry = fallbackCounters.get(key);

  if (!currentEntry || currentEntry.resetAt <= now) {
    fallbackCounters.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  currentEntry.count += 1;

  if (currentEntry.count > limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((currentEntry.resetAt - now) / 1000));
    throw new ActionRateLimitError(retryAfterSeconds);
  }
}

async function consumeRedisRateLimit(key: string, limit: number, windowMs: number): Promise<void> {
  const redisClient = await getRateLimitRedisClient();

  if (!redisClient) {
    consumeFallbackRateLimit(key, limit, windowMs);
    return;
  }

  try {
    const totalHits = await redisClient.incr(key);

    if (totalHits === 1) {
      await redisClient.pexpire(key, windowMs);
    }

    let ttlMs = await redisClient.pttl(key);

    if (ttlMs < 0) {
      await redisClient.pexpire(key, windowMs);
      ttlMs = windowMs;
    }

    if (totalHits > limit) {
      throw new ActionRateLimitError(Math.max(1, Math.ceil(ttlMs / 1000)));
    }
  } catch (error) {
    if (error instanceof ActionRateLimitError) {
      throw error;
    }

    consumeFallbackRateLimit(key, limit, windowMs);
  }
}

export async function enforceActionRateLimit({
  limit,
  requestHeaders,
  scope,
  windowMs,
}: EnforceActionRateLimitOptions): Promise<void> {
  const actorKey = await resolveActorKey(requestHeaders);
  const rateLimitKey = `${DEFAULT_RATE_LIMIT_PREFIX}${scope}:${actorKey}`;

  await consumeRedisRateLimit(rateLimitKey, limit, windowMs);
}
