import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import documentRoutes from './routes/documentRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

export const createApp = () => {
  const app = express();

  // CORS Configuration
  const clientUrl = process.env.CLIENT_URL;
  app.use(
    cors({
      origin: clientUrl && clientUrl !== '*' ? [clientUrl, 'http://localhost:5173', 'http://localhost:3000'] : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Static uploads directory for development inspection if needed
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'server/uploads')));

  // API Health check
  app.get('/api/health', (_req, res) => {
    const readyState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const isConnected = readyState === 1;

    res.status(200).json({
      success: true,
      status: 'ok',
      server: 'running',
      database: isConnected ? 'connected' : 'disconnected',
      databaseName: isConnected ? mongoose.connection.name : '',
      readyState,
    });
  });

  // API Routes (Primary /api/*)
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/documents', documentRoutes);

  // Secondary aliases (/app/* and /app/api/*) in case VITE_API_URL is configured as /app or /app/api
  app.use('/app/auth', authRoutes);
  app.use('/app/users', userRoutes);
  app.use('/app/documents', documentRoutes);
  app.use('/app/api/auth', authRoutes);
  app.use('/app/api/users', userRoutes);
  app.use('/app/api/documents', documentRoutes);

  // Direct top-level routes fallback in case relative paths are used without prefix
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/documents', documentRoutes);

  // Catch-all 404 JSON handler for API paths to prevent falling through to HTML SPA
  app.use(['/api/*', '/app/*', '/app/api/*'], (_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });

  // Error Handler Middleware
  app.use(errorHandler);

  return app;
};

export default createApp;
