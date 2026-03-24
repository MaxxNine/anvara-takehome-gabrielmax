import { beforeEach, describe, expect, it, vi } from 'vitest';

import { applyAuthRouteRateLimit, resolveAuthRouteRateLimitPolicy } from './auth-rate-limit';

vi.mock('server-only', () => ({}));

const { getRateLimitRedisClientMock, getSessionMock } = vi.hoisted(() => ({
  getRateLimitRedisClientMock: vi.fn(),
  getSessionMock: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

vi.mock('@/lib/rate-limit/redis', () => ({
  getRateLimitRedisClient: getRateLimitRedisClientMock,
}));

describe('resolveAuthRouteRateLimitPolicy', () => {
  it('uses a strict credential-entry policy for sign-in requests', () => {
    const request = new Request('http://localhost:3847/api/auth/sign-in/email', {
      method: 'POST',
    });

    expect(resolveAuthRouteRateLimitPolicy(request)).toEqual({
      actor: 'ip_only',
      limit: 10,
      scope: 'auth:credential-entry',
      windowMs: 15 * 60 * 1000,
    });
  });

  it('uses a relaxed policy for read-only auth session checks', () => {
    const request = new Request('http://localhost:3847/api/auth/get-session', {
      method: 'GET',
    });

    expect(resolveAuthRouteRateLimitPolicy(request)).toEqual({
      actor: 'authenticated_or_ip',
      limit: 120,
      scope: 'auth:get',
      windowMs: 15 * 60 * 1000,
    });
  });
});

describe('applyAuthRouteRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRateLimitRedisClientMock.mockResolvedValue(null);
    getSessionMock.mockResolvedValue(null);
  });

  it('returns a 429 response after repeated sign-in attempts from the same IP', async () => {
    const request = new Request('http://localhost:3847/api/auth/sign-in/email', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '203.0.113.20',
      },
    });

    for (let index = 0; index < 10; index += 1) {
      await expect(applyAuthRouteRateLimit(request)).resolves.toBeNull();
    }

    const limitedResponse = await applyAuthRouteRateLimit(request);
    expect(limitedResponse?.status).toBe(429);
    expect(limitedResponse?.headers.get('Retry-After')).toBeTruthy();
    await expect(limitedResponse?.json()).resolves.toEqual({
      error: 'Too many requests, please try again later',
    });
  });
});
