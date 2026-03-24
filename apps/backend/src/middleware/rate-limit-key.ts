import { ipKeyGenerator } from 'express-rate-limit';
import type { Request } from 'express';

import type { AuthRequest } from '../types/index.js';

export function hasAuthIdentityHint(request: Request): boolean {
  return Boolean(request.headers.cookie || request.headers.authorization);
}

export function getClientIpKey(request: Request): string {
  const clientIp = request.ip || request.socket.remoteAddress || 'unknown';
  return `ip:${ipKeyGenerator(clientIp)}`;
}

export async function resolveRateLimitKey(
  request: Request,
  sessionResolver?: (request: AuthRequest) => Promise<AuthRequest['authSession']>
): Promise<string> {
  const authRequest = request as AuthRequest;

  if (authRequest.user?.id) {
    return `user:${authRequest.user.id}`;
  }

  if (!hasAuthIdentityHint(request)) {
    return getClientIpKey(request);
  }

  if (!sessionResolver) {
    return getClientIpKey(request);
  }

  const session = await sessionResolver(authRequest);

  if (session?.user?.id) {
    return `user:${session.user.id}`;
  }

  return getClientIpKey(request);
}
