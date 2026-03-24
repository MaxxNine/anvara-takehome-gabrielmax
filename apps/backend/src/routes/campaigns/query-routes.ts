import type { IRouter, NextFunction, Response } from 'express';
import { getCampaignById, isCampaignStatus, listCampaigns } from '../../services/campaign/index.js';
import { NotFoundError, type AuthRequest } from '../../types/index.js';
import { getParam } from '../../utils/helpers.js';

export function registerCampaignQueryRoutes(router: IRouter): void {
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

  router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await getCampaignById(getParam(req.params.id));

      if (!campaign) throw new NotFoundError('Campaign not found');
      if (req.user?.role === 'SPONSOR' && campaign.sponsorId !== req.user.sponsorId) {
        throw new NotFoundError('Campaign not found');
      }

      res.json(campaign);
    } catch (error) {
      next(error);
    }
  });
}
