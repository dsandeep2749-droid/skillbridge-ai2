import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { generateRoadmapRequestSchema } from '../schemas/roadmap.schema.js';
import {
  generateRoadmap,
  getRoadmaps,
  getRoadmapById,
  deleteRoadmap,
  updateRoadmapTask,
} from '../controllers/roadmapController.js';

export const roadmapRouter = Router();

roadmapRouter.use(requireAuth);

roadmapRouter.post(
  '/generate',
  aiLimiter,
  validateBody(generateRoadmapRequestSchema),
  generateRoadmap
);
roadmapRouter.get('/', getRoadmaps);
roadmapRouter.get('/:id', getRoadmapById);
roadmapRouter.delete('/:id', deleteRoadmap);
roadmapRouter.patch('/:roadmapId/tasks/:taskId', updateRoadmapTask);
