'use client';

import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

type NewsletterResponse = {
  error?: string;
  message?: string;
  success?: boolean;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

type UseNewsletterSubscribeReturn = {
  errorMessage: string;
  resetError: () => void;
  status: Status;
  subscribe: (email: string) => Promise<boolean>;
};

export function useNewsletterSubscribe(): UseNewsletterSubscribeReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const subscribe = useCallback(async (email: string): Promise<boolean> => {
    if (!email) return false;

    setStatus('loading');
    setErrorMessage('');

    try {
      const data = await api<NewsletterResponse>('/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (data.success) {
        setStatus('success');
        return true;
      }

      setStatus('error');
      setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
      return false;
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      return false;
    }
  }, []);

  const resetError = useCallback(() => {
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [status]);

  return { errorMessage, resetError, status, subscribe };
}
