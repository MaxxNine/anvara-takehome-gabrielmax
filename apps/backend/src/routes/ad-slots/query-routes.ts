import type { IRouter, NextFunction, Response } from 'express';
import {
  getAdSlotById,
  isAdSlotType,
  listAdSlots,
  listMarketplaceAdSlots,
} from '../../services/ad-slot/index.js';
import { NotFoundError, ValidationError, type AuthRequest } from '../../types/index.js';
import { getParam } from '../../utils/helpers.js';

import { parseMarketplaceAdSlotFilters } from './marketplace-query.js';

export function registerAdSlotQueryRoutes(router: IRouter): void {
  router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { type, available } = req.query;
      const adSlots = await listAdSlots({
        ...(isAdSlotType(type) && { type }),
        ...(req.user?.role === 'PUBLISHER' && { publisherId: req.user.publisherId }),
        availableOnly: available === 'true',
      });

      res.json(adSlots);
    } catch (error) {
      next(error);
    }
  });

  router.get('/marketplace', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const marketplaceAdSlots = await listMarketplaceAdSlots(
        parseMarketplaceAdSlotFilters(
          req.query as Record<string, unknown>,
          req.user?.role === 'PUBLISHER' ? req.user.publisherId : undefined
        )
      );

      res.json(marketplaceAdSlots);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);

      if (!id) throw new ValidationError('id is required');

      const adSlot = await getAdSlotById(id);

      if (!adSlot) throw new NotFoundError('Ad slot not found');
      if (req.user?.role === 'PUBLISHER' && adSlot.publisherId !== req.user.publisherId) {
        throw new NotFoundError('Ad slot not found');
      }

      res.json(adSlot);
    } catch (error) {
      next(error);
    }
  });
}
