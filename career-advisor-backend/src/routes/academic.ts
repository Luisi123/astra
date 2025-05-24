import express from 'express';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user grades
router.get('/grades', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ grades: user.grades });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user grades
router.put('/grades', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { grades } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.user?.email },
      { grades },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ grades: user.grades });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get overall progress
router.get('/progress', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ progress: user.progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 