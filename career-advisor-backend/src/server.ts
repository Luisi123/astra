import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import User, { IUser } from './models/User'; // Import the User model
import profileRoutes from './routes/profile';
import academicRoutes from './routes/academic';
import applicationRoutes from './routes/applications';
import chatRoutes from './routes/chat';
import authRoutes from './routes/auth';
import { authenticateToken, AuthRequest } from './middleware/auth';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for JWT secret

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoURI) {
  console.error('MongoDB URI is not defined in the .env file.');
  process.exit(1); // Exit the process if URI is missing
}

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// @route   GET /api/auth/validate
// @desc    Validate token and return user info
// @access  Private
app.get('/api/auth/validate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      message: 'Token is valid',
      email: user.email,
      name: user.name,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ 
      message: 'Token validation failed',
      code: 'VALIDATION_ERROR'
    });
  }
});

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { email, password, name, age, school } = req.body;
  
  console.log('Signup request received:', {
    email,
    name,
    age,
    school,
    passwordLength: password ? password.length : 0
  });

  // Basic validation
  if (!email || !password || !name || !age || !school) {
    console.log('Signup validation failed - Missing fields:', {
      email: !email,
      password: !password,
      name: !name,
      age: !age,
      school: !school
    });
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    // Check if user already exists
    console.log('Checking if user exists:', email);
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    console.log('Creating new user:', {
      email,
      name,
      age,
      school
    });

    // Create new user instance with required fields
    user = new User({
      email,
      password,
      name,
      age,
      school,
      interests: [],
      achievements: [],
      grades: [],
      progress: 0
    });

    // Save user to database (password hashing happens in pre-save hook)
    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully');

    // Generate JWT token with longer expiration
    console.log('Generating JWT token...');
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    console.log('Token generated successfully');

    // Respond with token and user data (excluding password)
    console.log('Sending success response');
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        school: user.school
      }
    });

  } catch (error: any) {
    console.error('Signup error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Handle Mongoose validation errors or duplicate key errors more specifically
    if (error.code === 11000) { // Duplicate key error (for unique email)
      console.log('Duplicate email error');
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (error.name === 'ValidationError') {
      console.log('Validation error:', error.errors);
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    console.log('Login attempt for email:', email);
    // Find user by email, explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found, comparing passwords');
    // Compare provided password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password match, generating token');
    // Generate JWT token with longer expiration
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    // Respond with token and user ID
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      userId: user._id,
      email: user.email
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Example protected route
app.get('/api/protected', authenticateToken, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    message: `Welcome to the protected route, user ${req.user?.email}!`,
    email: req.user?.email
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access protected route at http://localhost:${PORT}/api/protected`);
});