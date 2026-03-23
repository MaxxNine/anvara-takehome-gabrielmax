import { Router, type Request, type Response, type IRouter } from 'express';
import { resolveUserRole } from '../services/auth.service.js';
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
router.get('/me', async (req: Request, res: Response) => {
  // TODO: Challenge 3 - Implement auth middleware to validate session
  // For now, return unauthorized
  res.status(401).json({ error: 'Not authenticated' });
});

// GET /api/auth/role/:userId - Get user role based on Sponsor/Publisher records
router.get('/role/:userId', async (req: Request, res: Response) => {
  try {
    const userId = getParam(req.params.userId);

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const roleData = await resolveUserRole(userId);

    if (roleData.role === 'SPONSOR') {
      res.json({ role: 'sponsor', sponsorId: roleData.sponsorId, name: roleData.name });
      return;
    }

    if (roleData.role === 'PUBLISHER') {
      res.json({ role: 'publisher', publisherId: roleData.publisherId, name: roleData.name });
      return;
    }

    // User has no role assigned
    res.json({ role: null });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
});

export default router;
