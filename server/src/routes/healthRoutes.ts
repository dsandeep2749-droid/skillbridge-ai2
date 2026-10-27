import { Router, Request, Response } from 'express';
import { config } from '../config/env.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'SkillBridge AI API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      integrations: {
        aiConfigured: config.isAiConfigured,
        model: config.geminiModel,
        supabaseConfigured: config.isSupabaseConfigured,
      },
    },
  });
});
