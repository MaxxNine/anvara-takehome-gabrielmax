import type { IRouter, NextFunction, Response } from 'express';
import { roleMiddleware } from '../../middleware/auth.js';
import {
  buildCreateCampaignInput,
  buildUpdateCampaignInput,
  createCampaign,
  deleteCampaign,
  getCampaignById,
  updateCampaign,
} from '../../services/campaign/index.js';
import { ForbiddenError, NotFoundError, ValidationError, type AuthRequest } from '../../types/index.js';
import { getParam } from '../../utils/helpers.js';

function getSponsorId(req: AuthRequest): string {
  if (!req.user || req.user.role !== 'SPONSOR') throw new ForbiddenError();
  return req.user.sponsorId;
}

async function getOwnedCampaign(id: string, sponsorId: string) {
  const campaign = await getCampaignById(id);
  if (!campaign) throw new NotFoundError('Campaign not found');
  if (campaign.sponsorId !== sponsorId) throw new ForbiddenError();
  return campaign;
}

export function registerCampaignMutationRoutes(router: IRouter): void {
  router.post('/', roleMiddleware(['SPONSOR']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await createCampaign(
        buildCreateCampaignInput(req.body as Record<string, unknown>, getSponsorId(req))
      );
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', roleMiddleware(['SPONSOR']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);

      if (!id) throw new ValidationError('id is required');

      const existingCampaign = await getOwnedCampaign(id, getSponsorId(req));
      const campaign = await updateCampaign(
        id,
        buildUpdateCampaignInput(req.body as Record<string, unknown>, existingCampaign)
      );
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', roleMiddleware(['SPONSOR']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);

      if (!id) throw new ValidationError('id is required');

      await getOwnedCampaign(id, getSponsorId(req));
      await deleteCampaign(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}
