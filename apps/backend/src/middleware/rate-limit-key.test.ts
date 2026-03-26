import { describe, expect, it, vi } from 'vitest';

import type { AuthRequest } from '../types/index.js';
import { getClientIpKey, hasAuthIdentityHint, resolveRateLimitKey } from './rate-limit-key.js';

function createRequest(overrides: Partial<AuthRequest> = {}): AuthRequest {
  return {
    headers: {},
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  } as AuthRequest;
}

describe('rate limit key resolution', () => {
  it('detects auth identity hints from cookies or authorization headers', () => {
    expect(hasAuthIdentityHint(createRequest())).toBe(false);
    expect(hasAuthIdentityHint(createRequest({ headers: { cookie: 'session=123' } }))).toBe(true);
    expect(
      hasAuthIdentityHint(createRequest({ headers: { authorization: 'Bearer token' } }))
    ).toBe(true);
  });

  it('uses the authenticated user id when req.user is already present', async () => {
    const request = createRequest({
      user: {
        id: 'user-123',
        email: 'sponsor@example.com',
        role: 'SPONSOR',
        sponsorId: 'sponsor-1',
      },
    });

    const sessionResolver = vi.fn();

    await expect(resolveRateLimitKey(request, sessionResolver)).resolves.toBe('user:user-123');
    expect(sessionResolver).not.toHaveBeenCalled();
  });

  it('falls back to the request IP when there is no auth hint', async () => {
    const request = createRequest({ ip: '203.0.113.9' });

    await expect(resolveRateLimitKey(request)).resolves.toBe(getClientIpKey(request));
  });

  it('uses the resolved session user id when auth headers are present', async () => {
    const request = createRequest({
      headers: { cookie: 'session=abc' },
      ip: '203.0.113.9',
    });

    const sessionResolver = vi.fn().mockResolvedValue({
      user: { id: 'user-456' },
    });

    await expect(resolveRateLimitKey(request, sessionResolver)).resolves.toBe('user:user-456');
    expect(sessionResolver).toHaveBeenCalledOnce();
  });

  it('falls back to the request IP when auth resolution does not find a user', async () => {
    const request = createRequest({
      headers: { authorization: 'Bearer token' },
      ip: '203.0.113.9',
    });

    const sessionResolver = vi.fn().mockResolvedValue(null);

    await expect(resolveRateLimitKey(request, sessionResolver)).resolves.toBe(getClientIpKey(request));
  });
});
