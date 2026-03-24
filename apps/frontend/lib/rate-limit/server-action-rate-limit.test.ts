import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ActionRateLimitError } from './errors';
import { enforceActionRateLimit } from './server-action-rate-limit';

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

vi.mock('./redis', () => ({
  getRateLimitRedisClient: getRateLimitRedisClientMock,
}));

describe('enforceActionRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRateLimitRedisClientMock.mockResolvedValue(null);
  });

  it('rate limits repeated requests for the same authenticated user when redis is unavailable', async () => {
    getSessionMock.mockResolvedValue({
      user: { id: 'user-1' },
    });
    const scope = `test-booking-${crypto.randomUUID()}`;

    await enforceActionRateLimit({
      limit: 1,
      requestHeaders: new Headers({ cookie: 'session=abc' }),
      scope,
      windowMs: 10_000,
    });

    await expect(
      enforceActionRateLimit({
        limit: 1,
        requestHeaders: new Headers({ cookie: 'session=abc' }),
        scope,
        windowMs: 10_000,
      })
    ).rejects.toBeInstanceOf(ActionRateLimitError);
  });

  it('blocks repeated requests for the same anonymous client ip when redis is unavailable', async () => {
    getSessionMock.mockResolvedValue(null);
    const scope = `test-reset-${crypto.randomUUID()}`;
    const requestHeaders = new Headers({ 'x-forwarded-for': '203.0.113.10' });

    await enforceActionRateLimit({
      limit: 1,
      requestHeaders,
      scope,
      windowMs: 10_000,
    });

    await expect(
      enforceActionRateLimit({
        limit: 1,
        requestHeaders,
        scope,
        windowMs: 10_000,
      })
    ).rejects.toBeInstanceOf(ActionRateLimitError);
  });

  it('keeps different anonymous ips in separate buckets', async () => {
    getSessionMock.mockResolvedValue(null);
    const scope = `test-split-${crypto.randomUUID()}`;

    await enforceActionRateLimit({
      limit: 1,
      requestHeaders: new Headers({ 'x-forwarded-for': '203.0.113.11' }),
      scope,
      windowMs: 10_000,
    });

    await expect(
      enforceActionRateLimit({
        limit: 1,
        requestHeaders: new Headers({ 'x-forwarded-for': '203.0.113.12' }),
        scope,
        windowMs: 10_000,
      })
    ).resolves.toBeUndefined();
  });
});
