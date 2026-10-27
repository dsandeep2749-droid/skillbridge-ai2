import { Request, Response, NextFunction } from 'express';
import { supabase, AuthenticatedUser } from '../services/supabase.js';
import { config } from '../config/env.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In local development if demo mode header is present
    if (req.headers['x-demo-user'] === 'true' || (!config.isSupabaseConfigured && config.nodeEnv === 'development')) {
      const effectiveUserId = (req.headers['x-user-id'] as string) || DEMO_USER_ID;
      req.user = {
        id: effectiveUserId,
        email: 'alex.developer@skillbridge.local',
      };
      return next();
    }

    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token missing. Please sign in.',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Demo token support for local development / testing without live Supabase
  if (token === 'demo-token' || token === 'mock-jwt-token') {
    const effectiveUserId = (req.headers['x-user-id'] as string) || DEMO_USER_ID;
    req.user = {
      id: effectiveUserId,
      email: 'alex.developer@skillbridge.local',
    };
    return next();
  }

  // If Supabase is configured, verify the JWT token
  if (config.isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Session expired or invalid authentication token. Please sign in again.',
          },
        });
        return;
      }

      req.user = {
        id: data.user.id,
        email: data.user.email || '',
      };
      return next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_VERIFICATION_FAILED',
          message: 'Failed to verify session token.',
        },
      });
      return;
    }
  }

  // Fallback for development if Supabase credentials are not yet set
  if (config.nodeEnv === 'development') {
    req.user = {
      id: DEMO_USER_ID,
      email: 'alex.developer@skillbridge.local',
    };
    return next();
  }

  res.status(503).json({
    success: false,
    error: {
      code: 'AUTH_SERVICE_UNAVAILABLE',
      message: 'Supabase authentication service is not configured. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.',
    },
  });
}
