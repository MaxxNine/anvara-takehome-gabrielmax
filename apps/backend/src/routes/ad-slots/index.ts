import { Router, type IRouter } from 'express';
import { requireAuth } from '../../middleware/auth.js';

import { registerAdSlotMutationRoutes } from './mutation-routes.js';
import { registerAdSlotQueryRoutes } from './query-routes.js';

const router: IRouter = Router();
router.use(requireAuth);
registerAdSlotQueryRoutes(router);
registerAdSlotMutationRoutes(router);

export default router;
