'use server';

import { headers } from 'next/headers';

import { getPostLoginRedirectPath } from '@/lib/auth-helpers';

export async function resolveLoginRedirectAction(): Promise<string> {
  const requestHeaders = await headers();
  return getPostLoginRedirectPath(requestHeaders);
}
