import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import { connectDB } from '../config/db';

/**
 * @desc    Register a new user in MongoDB
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();

    const { name, fullName, email, password } = req.body;
    const userName = (name || fullName || '').trim();

    if (!userName) {
      res.status(400).json({
        success: false,
        message: 'Name is required for registration.',
      });
      return;
    }

    if (!email || !email.trim()) {
      res.status(400).json({
        success: false,
        message: 'Valid email is required.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists in MongoDB
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
      return;
    }

    // Store user in MongoDB; password hashed via Mongoose pre-save hook
    const user = await User.create({
      name: userName,
      fullName: userName,
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[AuthController] Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

/**
 * @desc    Authenticate user & get JWT token from MongoDB
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !email.trim()) {
      res.status(400).json({
        success: false,
        message: 'Please enter your email address.',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Please enter your password.',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user in MongoDB
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
      return;
    }

    // Compare password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name || user.fullName,
        fullName: user.fullName || user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[AuthController] Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/users/me
 * @route   GET /api/auth/me
 * @access  Private (Protected by JWT)
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
      return;
    }

    res.json({
      success: true,
      user: {
        _id: req.user._id,
        id: req.user._id,
        name: req.user.name || req.user.fullName,
        fullName: req.user.fullName || req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile.',
    });
  }
};
