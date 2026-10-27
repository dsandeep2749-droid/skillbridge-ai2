import { Router } from 'express';
import { healthRouter } from './healthRoutes.js';
import { profileRouter } from './profileRoutes.js';
import { resumeRouter } from './resumeRoutes.js';
import { skillGapRouter } from './skillGapRoutes.js';
import { roadmapRouter } from './roadmapRoutes.js';
import { interviewRouter } from './interviewRoutes.js';

export const apiRouter = Router();

apiRouter.use('/', healthRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/resumes', resumeRouter);
apiRouter.use('/skill-gap', skillGapRouter);
apiRouter.use('/roadmaps', roadmapRouter);
apiRouter.use('/interviews', interviewRouter);
