import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose / MongoDB connection errors
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    (typeof err.message === 'string' && (err.message.includes('buffering timed out') || err.message.includes('before running operations')))
  ) {
    console.error('[MongoDB Error]:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable. Please try again in a moment.',
    });
    return;
  }

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the 50MB limit';
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    message = `An account with this ${field} already exists`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errorMessages = Object.values(err.errors).map((e: any) => e.message);
    message = errorMessages.join('. ');
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired, please sign in again';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
