'use client';

import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import {
  ApiError,
  type NewsletterSubscribeResponse,
  newsletterSubscribeMutationOptions,
} from '@/lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

type UseNewsletterSubscribeReturn = {
  errorMessage: string;
  resetError: () => void;
  status: Status;
  subscribe: (email: string) => Promise<boolean>;
};

export function useNewsletterSubscribe(): UseNewsletterSubscribeReturn {
  const mutation = useMutation(newsletterSubscribeMutationOptions());

  const subscribe = useCallback(
    async (email: string): Promise<boolean> => {
      if (!email) {
        return false;
      }

      try {
        const data = await mutation.mutateAsync(email);

        if (data.success) {
          return true;
        }

        throw new ApiError(
          data.error ?? data.message ?? 'Something went wrong. Please try again.',
          400,
          data satisfies NewsletterSubscribeResponse
        );
      } catch {
        return false;
      }
    },
    [mutation]
  );

  const resetError = useCallback(() => {
    if (mutation.status === 'error') {
      mutation.reset();
    }
  }, [mutation]);

  const status: Status =
    mutation.status === 'pending'
      ? 'loading'
      : mutation.status === 'success'
        ? 'success'
        : mutation.status === 'error'
          ? 'error'
          : 'idle';

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.status === 'error'
        ? 'Something went wrong. Please try again.'
        : '';

  return { errorMessage, resetError, status, subscribe };
}
