import { redirect } from 'next/navigation';

import type { ActionState } from './action-types';
import { ApiError } from './server-api';

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

  const message = error instanceof Error ? error.message : fallbackMessage;
  return { success: false, error: message, ...(fieldValues && { fieldValues }) };
}
