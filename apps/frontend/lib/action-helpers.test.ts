import { describe, expect, it, vi } from 'vitest';

import { handleActionError } from './action-helpers';
import { ActionRateLimitError } from './rate-limit/errors';
import { ApiError } from './server-api';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
}));

vi.mock('server-only', () => ({}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('handleActionError', () => {
  it('normalizes frontend action rate limit errors', () => {
    expect(handleActionError(new ActionRateLimitError(42), 'Fallback message')).toEqual({
      success: false,
      error: 'Too many requests, please try again later',
      errorKind: 'rate_limit',
      retryAfterSeconds: 42,
    });
  });

  it('normalizes backend 429 errors and preserves field values', () => {
    const error = new ApiError('Too many requests, please try again later', 429, 30);

    expect(handleActionError(error, 'Fallback message', { message: 'hello' })).toEqual({
      success: false,
      error: 'Too many requests, please try again later',
      errorKind: 'rate_limit',
      fieldValues: { message: 'hello' },
      retryAfterSeconds: 30,
    });
  });

  it('redirects to login on unauthorized api errors', () => {
    handleActionError(new ApiError('Not authenticated', 401), 'Fallback message');

    expect(redirectMock).toHaveBeenCalledWith('/login');
  });

  it('returns a generic action state for non-rate-limit errors', () => {
    expect(handleActionError(new Error('Something failed'), 'Fallback message')).toEqual({
      success: false,
      error: 'Something failed',
    });
  });
});
