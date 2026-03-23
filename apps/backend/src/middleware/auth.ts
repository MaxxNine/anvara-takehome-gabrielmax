import { fromNodeHeaders } from 'better-auth/node';
import { type Response, type NextFunction } from 'express';
import { auth } from '../auth.js';
import { resolveUserRole } from '../services/auth/index.js';
import type { AuthRequest, AuthUser, AuthUserRole } from '../types/index.js';

function buildAuthUser(
  user: { id: string; email: string },
  roleData: Awaited<ReturnType<typeof resolveUserRole>>
): AuthUser | null {
  if (roleData.role === 'SPONSOR') {
    return {
      id: user.id,
      email: user.email,
      role: 'SPONSOR',
      sponsorId: roleData.sponsorId,
    };
  }

  if (roleData.role === 'PUBLISHER') {
    return {
      id: user.id,
      email: user.email,
      role: 'PUBLISHER',
      publisherId: roleData.publisherId,
    };
  }

  return null;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const roleData = await resolveUserRole(session.user.id);
  const authUser = buildAuthUser(session.user, roleData);

  if (!authUser) {
    res.status(403).json({ error: 'User has no assigned role' });
    return;
  }

  req.user = authUser;
  next();
}

export function roleMiddleware(allowedRoles: AuthUserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
