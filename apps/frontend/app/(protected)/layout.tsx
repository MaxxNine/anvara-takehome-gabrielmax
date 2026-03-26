import { headers } from 'next/headers';

import { requireAuthenticatedSession } from '@/lib/auth-helpers';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const requestHeaders = await headers();
  await requireAuthenticatedSession(requestHeaders);

  return children;
}
