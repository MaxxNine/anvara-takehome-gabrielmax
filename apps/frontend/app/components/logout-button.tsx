'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/auth-client';
import { GA_EVENTS, trackEventAndRun } from '@/lib/analytics';

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout(): Promise<void> {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await trackEventAndRun(
        GA_EVENTS.LOGOUT,
        async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.replace('/');
              },
            },
          });
        },
        undefined,
        800
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isSubmitting}
      className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? 'Logging out...' : 'Logout'}
    </button>
  );
}
