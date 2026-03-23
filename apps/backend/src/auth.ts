import { betterAuth } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { type Response, type NextFunction } from 'express';
import { Pool } from 'pg';
import { resolveUserRole } from './services/auth/index.js';
import type { AuthRequest, AuthUser, AuthUserRole } from './types/index.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const auth = betterAuth({
  database: new Pool({ connectionString }),
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-dev',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3847',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [],
  advanced: {
    disableCSRFCheck: true,
  },
});

function buildAuthUser(user: { id: string; email: string }, roleData: Awaited<ReturnType<typeof resolveUserRole>>): AuthUser | null {
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
