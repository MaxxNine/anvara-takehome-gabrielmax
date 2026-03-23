import type { Request } from 'express';
import rateLimit, {
  MemoryStore,
  type RateLimitExceededEventHandler,
  type Store,
} from 'express-rate-limit';
import Redis from 'ioredis';
import { RedisStore, type RedisReply } from 'rate-limit-redis';

const WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_RESPONSE = { error: 'Too many requests, please try again later' };
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let hasLoggedRedisError = false;

function logRedisWarning(): void {
  if (hasLoggedRedisError) {
    return;
  }

  hasLoggedRedisError = true;
  console.warn('Redis rate limit store unavailable; falling back to in-memory rate limiting');
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

function createStore(redisClient: Redis | null, prefix: string): Store {
  if (!redisClient) {
    return new MemoryStore();
  }

  return new RedisStore({
    prefix,
    sendCommand: (command: string, ...args: string[]) =>
      redisClient.call(command, ...args) as Promise<RedisReply>,
  });
}

const rateLimitHandler: RateLimitExceededEventHandler = (req, res, _next, options) => {
  const resetTime = (req as Request & { rateLimit?: { resetTime?: Date } }).rateLimit?.resetTime;
  const retryAfterSeconds = resetTime
    ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
    : Math.ceil(options.windowMs / 1000);

  res.setHeader('Retry-After', retryAfterSeconds.toString());
  res.status(options.statusCode).json(RATE_LIMIT_RESPONSE);
};

function createLimiter(limit: number, store: Store) {
  return rateLimit({
    windowMs: WINDOW_MS,
    limit,
    legacyHeaders: false,
    message: RATE_LIMIT_RESPONSE,
    passOnStoreError: true,
    standardHeaders: 'draft-8',
    store,
    handler: rateLimitHandler,
  });
}

const redisClient = await connectRedis();
const globalStore = createStore(redisClient, 'anvara:rate-limit:global:');
const authStore = createStore(redisClient, 'anvara:rate-limit:auth:');

export const globalLimiter = createLimiter(100, globalStore);
export const authLimiter = createLimiter(10, authStore);
