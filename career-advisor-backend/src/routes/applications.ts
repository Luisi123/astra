import express from 'express';
import Application from '../models/Application';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper to get user ObjectId from email
async function getUserIdByEmail(email: string) {
  const user = await User.findOne({ email });
  return user ? user._id : null;
}

// Get all applications for a user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ message: 'User email not found in token' });
    }
    const userId = await getUserIdByEmail(req.user.email as string);
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const applications = await Application.find({ userId });
    res.json(applications);
  } catch (error) {
    console.error('Error in GET /api/applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new application
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ message: 'User email not found in token' });
    }
    const userId = await getUserIdByEmail(req.user.email as string);
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { university, program, deadline, requirements } = req.body;
    const application = new Application({
      userId,
      university,
      program,
      deadline,
      requirements
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Error in POST /api/applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ message: 'User email not found in token' });
    }
    const userId = await getUserIdByEmail(req.user.email as string);
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { university, program, deadline, status, progress, requirements } = req.body;
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId },
      { university, program, deadline, status, progress, requirements },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Error in PUT /api/applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete application
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ message: 'User email not found in token' });
    }
    const userId = await getUserIdByEmail(req.user.email as string);
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 