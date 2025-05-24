import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      email: user.email,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, age, school } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      age,
      school,
      interests: [],
      achievements: [],
      grades: []
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      email: user.email,
      message: 'Signup successful'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Token validation route
router.get('/validate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      email: user.email,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

export default router; 