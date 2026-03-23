import { Router, type Response, type NextFunction, type IRouter } from 'express';
import { requireAuth, roleMiddleware } from '../auth.js';
import {
  bookAdSlot,
  createAdSlot,
  getAdSlotById,
  isAdSlotType,
  listAdSlots,
  unbookAdSlot,
} from '../services/ad-slot.service.js';
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
  type AuthRequest,
} from '../types/index.js';
import { getParam } from '../utils/helpers.js';

const router: IRouter = Router();
router.use(requireAuth);

// GET /api/ad-slots - List available ad slots
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

// GET /api/ad-slots/:id - Get single ad slot with details
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req.params.id);
    const adSlot = await getAdSlotById(id);

    if (!adSlot) {
      throw new NotFoundError('Ad slot not found');
    }

    if (req.user?.role === 'PUBLISHER' && adSlot.publisherId !== req.user.publisherId) {
      throw new NotFoundError('Ad slot not found');
    }

    res.json(adSlot);
  } catch (error) {
    next(error);
  }
});

// POST /api/ad-slots - Create new ad slot
router.post(
  '/',
  roleMiddleware(['PUBLISHER']),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, description, type, basePrice, width, height } = req.body;

      if (!name || !type || basePrice === undefined) {
        throw new ValidationError('Name, type, and basePrice are required');
      }

      if (!isAdSlotType(type)) {
        throw new ValidationError('Invalid ad slot type');
      }

      if (!req.user || req.user.role !== 'PUBLISHER') {
        throw new ForbiddenError();
      }

      const adSlot = await createAdSlot({
        name,
        description,
        type,
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        basePrice,
        publisherId: req.user.publisherId,
      });

      res.status(201).json(adSlot);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/ad-slots/:id/book - Book an ad slot (simplified booking flow)
router.post(
  '/:id/book',
  roleMiddleware(['SPONSOR']),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = getParam(req.params.id);
      const adSlot = await getAdSlotById(id);

      if (!adSlot) {
        throw new NotFoundError('Ad slot not found');
      }

      if (!adSlot.isAvailable) {
        throw new ValidationError('Ad slot is no longer available');
      }

      const updatedSlot = await bookAdSlot(id);

      res.json({
        success: true,
        message: 'Ad slot booked successfully!',
        adSlot: updatedSlot,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (for testing)
router.post('/:id/unbook', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req.params.id);
    const adSlot = await getAdSlotById(id);

    if (!adSlot) {
      throw new NotFoundError('Ad slot not found');
    }

    if (req.user?.role === 'PUBLISHER' && adSlot.publisherId !== req.user.publisherId) {
      throw new NotFoundError('Ad slot not found');
    }

    const updatedSlot = await unbookAdSlot(id);

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    next(error);
  }
});

// TODO: Add PUT /api/ad-slots/:id endpoint
// TODO: Add DELETE /api/ad-slots/:id endpoint

export default router;
