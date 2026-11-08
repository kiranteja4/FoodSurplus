import { ZodError } from 'zod';
import { env } from '../config/env.js';

export const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

// Centralized error handling: never leak stack traces or internals in production.
export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate value already exists' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid identifier' });
  }
  const status = err.isOperational ? err.statusCode : 500;
  if (!err.isOperational) console.error(err);
  res.status(status).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
    ...(err.details && { details: err.details }),
    ...(env.NODE_ENV === 'development' && !err.isOperational && { stack: err.stack }),
  });
}
