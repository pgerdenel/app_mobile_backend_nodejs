import { Router } from 'express';
import PanelRouter from './Panel';
import APIRouter from './API';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/API', APIRouter);
router.use('/panel', PanelRouter);

// Export the base-router
export default router;
