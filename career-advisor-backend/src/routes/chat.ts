import express from 'express';
import Chat from '../models/Chat';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper to get user ObjectId from email
async function getUserIdByEmail(email: string) {
  const user = await User.findOne({ email });
  return user ? user._id : null;
}

// Get chat history
router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ message: 'User email not found in token' });
    }
    const userId = await getUserIdByEmail(req.user.email as string);
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const chat = await Chat.findOne({ userId });
    if (!chat) {
      return res.json({ messages: [] });
    }
    res.json({ messages: chat.messages });
  } catch (error) {
    console.error('Error in GET /api/chat/history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message to AI assistant
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ message: 'User email not found in token' });
    }
    const userId = await getUserIdByEmail(req.user.email as string);
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { content } = req.body;
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // Add user message
    chat.messages.push({
      role: 'user' as const,
      content,
      timestamp: new Date()
    });

    // TODO: Integrate with actual AI service
    // For now, we'll just echo back a simple response
    const aiResponse = {
      role: 'assistant' as const,
      content: `I received your message: "${content}". This is a placeholder response.`,
      timestamp: new Date()
    };

    chat.messages.push(aiResponse);
    await chat.save();

    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 