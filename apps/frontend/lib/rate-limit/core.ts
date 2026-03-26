import 'server-only';

import { ActionRateLimitError } from './errors';
import { getRateLimitRedisClient } from './redis';

const fallbackCounters = new Map<string, { count: number; resetAt: number }>();

type EnforceRateLimitKeyOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

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

export async function enforceRateLimitKey({
  key,
  limit,
  windowMs,
}: EnforceRateLimitKeyOptions): Promise<void> {
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
