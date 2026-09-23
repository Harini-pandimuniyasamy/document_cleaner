import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createApp } from './app';
import { connectDB } from './config/db';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

async function start() {
  console.log('Loading environment variables...');
  const mongoUriExists = Boolean(process.env.MONGODB_URI);
  console.log(`MONGODB_URI detected: ${mongoUriExists ? 'YES' : 'NO'}`);

  if (!mongoUriExists) {
    console.error('MongoDB connection failed: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('MongoDB Connected Successfully');
    console.log(`Database: ${mongoose.connection.name}`);

    const app = createApp();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

start();
