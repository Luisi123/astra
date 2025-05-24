import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for a User document
export interface IUser extends Document {
  email: string;
  password?: string; // Password is optional as it will be hashed
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// Define the User schema
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Do not return the password by default in queries
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Pre-save hook to hash the password before saving a new user or updating password
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password!, salt); // Hash the password
    next();
  } catch (error: any) {
    next(error); // Pass any error to the next middleware
  }
});

// Method to compare candidate password with the hashed password in the database
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // 'this.password' needs to be explicitly selected in the query to be available here
  return await bcrypt.compare(candidatePassword, this.password!);
};

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;