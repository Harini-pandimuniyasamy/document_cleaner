import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createApp } from './server/src/app';
import { connectDB } from './server/src/config/db';

dotenv.config();

const PORT = 3000;

async function startServer() {
  console.log('Starting DocuClean AI Server...');

  if (process.env.MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await connectDB();
    } catch (err: any) {
      console.error('[MongoDB] Initial connection failed:', err?.message || err);
    }
  } else {
    console.warn('[MongoDB] MONGODB_URI is not set. Please provide MONGODB_URI for database persistence.');
  }

  try {
    const app = createApp();

    // Vite middleware for development vs static build for production
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          host: '0.0.0.0',
          port: PORT,
          allowedHosts: true,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

startServer();
