import type { IRouter, NextFunction, Response } from 'express';
import { getAdSlotById, isAdSlotType, listAdSlots } from '../../services/ad-slot/index.js';
import { NotFoundError, type AuthRequest } from '../../types/index.js';
import { getParam } from '../../utils/helpers.js';

export function registerAdSlotQueryRoutes(router: IRouter): void {
  router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { type, available } = req.query;
      const adSlots = await listAdSlots({
        ...(isAdSlotType(type) && { type }),
        ...(req.user?.role === 'PUBLISHER' && { publisherId: req.user.publisherId }),
        availableOnly: req.user?.role === 'SPONSOR' || available === 'true',
      });

      res.json(adSlots);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adSlot = await getAdSlotById(getParam(req.params.id));

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
