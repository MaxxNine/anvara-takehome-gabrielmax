import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam, isValidEmail } from '../utils/helpers.js';

const router: IRouter = Router();

// GET /api/sponsors - List all sponsors
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      include: {
        _count: {
          select: { campaigns: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

// GET /api/sponsors/:id - Get single sponsor with campaigns
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({ error: 'id is required' });
      return;
    }

    const sponsor = await prisma.sponsor.findUnique({
      where: { id },
      include: {
        campaigns: {
          include: {
            _count: { select: { placements: true } },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!sponsor) {
      res.status(404).json({ error: 'Sponsor not found' });
      return;
    }

    res.json(sponsor);
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    res.status(500).json({ error: 'Failed to fetch sponsor' });
  }
});

// POST /api/sponsors - Create new sponsor
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, website, logo, description, industry } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const sponsor = await prisma.sponsor.create({
      data: { name, email, website, logo, description, industry },
    });

    res.status(201).json(sponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    res.status(500).json({ error: 'Failed to create sponsor' });
  }
});

// PUT /api/sponsors/:id - Update sponsor details
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({ error: 'id is required' });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const updateData: Record<string, unknown> = {};

    if ('name' in body) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        res.status(400).json({ error: 'name must be a non-empty string' });
        return;
      }

      updateData.name = body.name.trim();
    }

    if ('email' in body) {
      if (typeof body.email !== 'string' || !isValidEmail(body.email)) {
        res.status(400).json({ error: 'email must be a valid email address' });
        return;
      }

      updateData.email = body.email.trim();
    }

    const optionalFields = ['website', 'logo', 'description', 'industry'] as const;

    for (const field of optionalFields) {
      if (!(field in body)) {
        continue;
      }

      const value = body[field];

      if (value === null) {
        updateData[field] = null;
        continue;
      }

      if (typeof value !== 'string') {
        res.status(400).json({ error: `${field} must be a string or null` });
        return;
      }

      const trimmedValue = value.trim();
      updateData[field] = trimmedValue.length > 0 ? trimmedValue : null;
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        error: 'Provide at least one field to update: name, email, website, logo, description, or industry',
      });
      return;
    }

    const existingSponsor = await prisma.sponsor.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingSponsor) {
      res.status(404).json({ error: 'Sponsor not found' });
      return;
    }

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: updateData,
    });

    res.json(sponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
});

export default router;
