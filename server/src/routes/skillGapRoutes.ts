import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { analyzeSkillGapRequestSchema } from '../schemas/skillGap.schema.js';
import {
  analyzeSkillGap,
  getSkillGapReports,
  getSkillGapReportById,
  deleteSkillGapReport,
} from '../controllers/skillGapController.js';

export const skillGapRouter = Router();

skillGapRouter.use(requireAuth);

skillGapRouter.post(
  '/analyze',
  aiLimiter,
  validateBody(analyzeSkillGapRequestSchema),
  analyzeSkillGap
);
skillGapRouter.get('/', getSkillGapReports);
skillGapRouter.get('/:id', getSkillGapReportById);
skillGapRouter.delete('/:id', deleteSkillGapReport);
