import 'server-only';

import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let hasLoggedRedisError = false;
let redisClientPromise: Promise<Redis | null> | null = null;

function logRedisWarning(): void {
  if (hasLoggedRedisError) {
    return;
  }

  hasLoggedRedisError = true;
  process.stderr.write(
    'Frontend rate limit Redis unavailable; falling back to in-memory rate limiting\n'
  );
}

async function connectRedis(): Promise<Redis | null> {
  const client = new Redis(REDIS_URL, {
    connectTimeout: 1_000,
    enableOfflineQueue: false,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  client.on('error', () => {
    logRedisWarning();
  });

  client.on('ready', () => {
    hasLoggedRedisError = false;
  });

  try {
    await client.connect();
    return client;
  } catch {
    logRedisWarning();
    client.disconnect();
    return null;
  }
}

export async function getRateLimitRedisClient(): Promise<Redis | null> {
  if (!redisClientPromise) {
    redisClientPromise = connectRedis();
  }

  return redisClientPromise;
}
