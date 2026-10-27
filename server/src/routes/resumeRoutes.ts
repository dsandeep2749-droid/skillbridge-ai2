import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import {
  analyzeResume,
  getResumeAnalyses,
  getResumeAnalysisById,
  deleteResumeAnalysis,
} from '../controllers/resumeController.js';

export const resumeRouter = Router();

resumeRouter.use(requireAuth);

resumeRouter.post('/analyze', aiLimiter, uploadResume.single('resume'), analyzeResume);
resumeRouter.get('/', getResumeAnalyses);
resumeRouter.get('/:id', getResumeAnalysisById);
resumeRouter.delete('/:id', deleteResumeAnalysis);
