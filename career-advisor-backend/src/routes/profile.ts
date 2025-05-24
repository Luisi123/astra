import express from 'express';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('Profile request received for email:', req.user?.email);
    
    if (!req.user?.email) {
      console.log('No user email in request');
      return res.status(401).json({ 
        message: 'User not authenticated',
        code: 'NO_USER_EMAIL'
      });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      console.log('User not found for email:', req.user.email);
      return res.status(404).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    console.log('Profile found for user:', req.user.email);
    res.json({
      ...user.toObject(),
      password: undefined // Remove password from response
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ message: 'User email not found in token' });
    }

    const { name, age, interests, achievements } = req.body;
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.age = age;
    user.interests = interests;
    user.achievements = achievements;

    await user.save();

    res.json({
      ...user.toObject(),
      password: undefined // Remove password from response
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user interests
router.get('/interests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ 
        message: 'User not authenticated',
        code: 'NO_USER_EMAIL'
      });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({ interests: user.interests });
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ 
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Update user interests
router.put('/interests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ 
        message: 'User not authenticated',
        code: 'NO_USER_EMAIL'
      });
    }

    const { interests } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { interests },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({ interests: user.interests });
  } catch (error) {
    console.error('Error updating interests:', error);
    res.status(500).json({ 
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

export default router; 