import { Router, type IRouter } from 'express';
import { requireAuth } from '../../middleware/auth.js';

import { registerCampaignMutationRoutes } from './mutation-routes.js';
import { registerCampaignQueryRoutes } from './query-routes.js';

const router: IRouter = Router();
router.use(requireAuth);
registerCampaignQueryRoutes(router);
registerCampaignMutationRoutes(router);

export default router;
