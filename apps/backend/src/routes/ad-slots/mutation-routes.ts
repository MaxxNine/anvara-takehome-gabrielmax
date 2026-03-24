import type { IRouter, NextFunction, Response } from 'express';
import { roleMiddleware } from '../../middleware/auth.js';
import {
  bookAdSlot,
  buildCreateAdSlotInput,
  buildUpdateAdSlotInput,
  createAdSlot,
  deleteAdSlot,
  getAdSlotById,
  unbookAdSlot,
  updateAdSlot,
} from '../../services/ad-slot/index.js';
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
  type AuthRequest,
} from '../../types/index.js';
import { getParam } from '../../utils/helpers.js';

function getPublisherId(req: AuthRequest): string {
  if (!req.user || req.user.role !== 'PUBLISHER') throw new ForbiddenError();
  return req.user.publisherId;
}

async function getOwnedAdSlot(id: string, publisherId: string) {
  const adSlot = await getAdSlotById(id);
  if (!adSlot) throw new NotFoundError('Ad slot not found');
  if (adSlot.publisherId !== publisherId) throw new ForbiddenError();
  return adSlot;
}

export function registerAdSlotMutationRoutes(router: IRouter): void {
  router.post('/', roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adSlot = await createAdSlot(
        buildCreateAdSlotInput(req.body as Record<string, unknown>, getPublisherId(req))
      );
      res.status(201).json(adSlot);
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/book', roleMiddleware(['SPONSOR']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);
      const adSlot = await getAdSlotById(id);

      if (!adSlot) throw new NotFoundError('Ad slot not found');
      if (!adSlot.isAvailable) throw new ValidationError('Ad slot is no longer available');

      res.json({
        success: true,
        message: 'Ad slot booked successfully!',
        adSlot: await bookAdSlot(id),
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/unbook', roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);
      await getOwnedAdSlot(id, getPublisherId(req));

      res.json({
        success: true,
        message: 'Ad slot is now available again',
        adSlot: await unbookAdSlot(id),
      });
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);
      await getOwnedAdSlot(id, getPublisherId(req));
      const adSlot = await updateAdSlot(id, buildUpdateAdSlotInput(req.body as Record<string, unknown>));
      res.json(adSlot);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);
      await getOwnedAdSlot(id, getPublisherId(req));
      await deleteAdSlot(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}
