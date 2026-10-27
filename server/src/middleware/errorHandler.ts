import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Safe logging without sensitive data
  const status = err.statusCode || (err.status ? err.status : 500);
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  
  if (config.nodeEnv !== 'test') {
    console.error(`[Error] ${req.method} ${req.path} - ${status} (${code}):`, err.message || err);
  }

  // Do not expose sensitive stack trace or raw internal errors
  const isDevelopment = config.nodeEnv === 'development';
  const clientMessage =
    status < 500
      ? err.message
      : 'An unexpected internal error occurred. Please try again later.';

  res.status(status).json({
    success: false,
    error: {
      code,
      message: clientMessage,
      ...(isDevelopment && status >= 500 ? { debug: err.message } : {}),
    },
  });
}
