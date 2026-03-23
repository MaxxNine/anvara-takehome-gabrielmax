import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';

import { requireAuth } from '../auth.js';
import { getAuthProfile } from '../services/auth/index.js';
import type { AuthRequest } from '../types/auth.js';
import { ForbiddenError, ValidationError } from '../types/errors.js';
import { getParam } from '../utils/helpers.js';

const router: IRouter = Router();

// NOTE: Authentication is handled by Better Auth on the frontend
// This route is kept for any backend-specific auth utilities

// POST /api/auth/login - Placeholder (Better Auth handles login via frontend)
router.post('/login', async (_req: Request, res: Response) => {
  res.status(400).json({
    error: 'Use the frontend login at /login instead',
    hint: 'Better Auth handles authentication via the Next.js frontend',
  });
});

// GET /api/auth/me - Get current user (for API clients)
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  res.json(req.user);
});

// GET /api/auth/profile - Frontend identity bootstrap payload
router.get(
  '/profile',
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json(await getAuthProfile(req.user!.id));
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/auth/role/:userId - Deprecated compatibility endpoint. Use /api/auth/profile.
router.get(
  '/role/:userId',
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = getParam(req.params.userId);

      if (!userId) {
        throw new ValidationError('userId is required');
      }

      if (!req.user || req.user.id !== userId) {
        throw new ForbiddenError();
      }

      res.setHeader('Deprecation', 'true');
      res.json(await getAuthProfile(userId));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
