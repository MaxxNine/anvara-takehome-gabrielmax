import { Router, type IRouter } from 'express';
import adSlotsRoutes from './ad-slots/index.js';
import authRoutes from './auth.js';
import campaignsRoutes from './campaigns/index.js';
import sponsorsRoutes from './sponsors.js';
import publishersRoutes from './publishers.js';
import placementsRoutes from './placements.js';
import dashboardRoutes from './dashboard.js';
import healthRoutes from './health.js';

const router: IRouter = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/sponsors', sponsorsRoutes);
router.use('/publishers', publishersRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/ad-slots', adSlotsRoutes);
router.use('/placements', placementsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/health', healthRoutes);

export default router;
