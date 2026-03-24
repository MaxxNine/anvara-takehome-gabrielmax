import { Router, type Response, type NextFunction, type IRouter } from 'express';
import { requireAuth, roleMiddleware } from '../middleware/auth.js';
import {
  createCampaign,
  getCampaignById,
  isCampaignStatus,
  listCampaigns,
} from '../services/campaign.service.js';
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
  type AuthRequest,
} from '../types/index.js';
import { getParam } from '../utils/helpers.js';

const router: IRouter = Router();
router.use(requireAuth);

// GET /api/campaigns - List all campaigns
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const campaigns = await listCampaigns({
      ...(isCampaignStatus(status) && { status }),
      ...(req.user?.role === 'SPONSOR' && { sponsorId: req.user.sponsorId }),
    });

    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

// GET /api/campaigns/:id - Get single campaign with details
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req.params.id);
    const campaign = await getCampaignById(id);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    if (req.user?.role === 'SPONSOR' && campaign.sponsorId !== req.user.sponsorId) {
      throw new NotFoundError('Campaign not found');
    }

    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

// POST /api/campaigns - Create new campaign
router.post(
  '/',
  roleMiddleware(['SPONSOR']),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate,
        endDate,
        targetCategories,
        targetRegions,
      } = req.body;

      if (!name || budget === undefined || !startDate || !endDate) {
        throw new ValidationError('Name, budget, startDate, and endDate are required');
      }

      if (!req.user || req.user.role !== 'SPONSOR') {
        throw new ForbiddenError();
      }

      const campaign = await createCampaign({
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId: req.user.sponsorId,
      });

      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  }
);

// TODO: Add PUT /api/campaigns/:id endpoint
// Update campaign details (name, budget, dates, status, etc.)

export default router;
