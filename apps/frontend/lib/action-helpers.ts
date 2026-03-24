import { redirect } from 'next/navigation';

import type { ActionState } from './action-types';
import { ActionRateLimitError } from './rate-limit/errors';
import { ApiError } from './server-api';

const RATE_LIMIT_MESSAGE = 'Too many requests, please try again later';

function createRateLimitActionState(
  retryAfterSeconds?: number,
  fieldValues?: Record<string, string>
): ActionState {
  return {
    success: false,
    error: RATE_LIMIT_MESSAGE,
    errorKind: 'rate_limit',
    ...(fieldValues && { fieldValues }),
    ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
  };
}

/**
 * Convert a caught error into an ActionState, handling auth failures.
 * If the user's session has expired (401), redirects to login.
 */
export function handleActionError(
  error: unknown,
  fallbackMessage: string,
  fieldValues?: Record<string, string>
): ActionState {
  if (error instanceof ApiError && error.isUnauthorized) {
    redirect('/login');
  }

  if (error instanceof ActionRateLimitError) {
    return createRateLimitActionState(error.retryAfterSeconds, fieldValues);
  }

  if (error instanceof ApiError && error.status === 429) {
    return createRateLimitActionState(error.retryAfterSeconds, fieldValues);
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  return { success: false, error: message, ...(fieldValues && { fieldValues }) };
}
