import type { ErrorRequestHandler } from 'express';
import { ForbiddenError, NotFoundError, ValidationError } from '../types/index.js';

function logUnhandledError(error: unknown): void {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled error:', error);
    return;
  }

  const errorName = error instanceof Error ? error.name : 'UnknownError';
  console.error('Unhandled error:', { name: errorName });
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof ForbiddenError) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }

  logUnhandledError(error);
  res.status(500).json({ error: 'Internal server error' });
};
