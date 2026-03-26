import { Router, type Request, type Response, type IRouter } from 'express';

const router: IRouter = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/subscribe
router.post('/subscribe', (req: Request, res: Response) => {
  const { email } = req.body ?? {};

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    res.status(400).json({ error: 'Please enter a valid email address' });
    return;
  }

  // Dummy endpoint — no database or service integration needed.
  // In production this would persist to a mailing list provider.
  res.json({ success: true, message: 'Thanks for subscribing!' });
});

export default router;
