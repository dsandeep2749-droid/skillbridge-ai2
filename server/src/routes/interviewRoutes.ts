import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import {
  generateInterviewRequestSchema,
  submitAnswerRequestSchema,
} from '../schemas/interview.schema.js';
import {
  generateInterview,
  submitInterviewAnswer,
  evaluateInterview,
  getInterviewSessions,
  getInterviewSessionById,
  deleteInterviewSession,
} from '../controllers/interviewController.js';

export const interviewRouter = Router();

interviewRouter.use(requireAuth);

interviewRouter.post(
  '/generate',
  aiLimiter,
  validateBody(generateInterviewRequestSchema),
  generateInterview
);
interviewRouter.post(
  '/:id/answer',
  validateBody(submitAnswerRequestSchema),
  submitInterviewAnswer
);
interviewRouter.post('/:id/evaluate', aiLimiter, evaluateInterview);
interviewRouter.get('/', getInterviewSessions);
interviewRouter.get('/:id', getInterviewSessionById);
interviewRouter.delete('/:id', deleteInterviewSession);
