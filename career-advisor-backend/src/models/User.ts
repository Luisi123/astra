import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for a User document
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age: number;
  school: string;
  interests: string[];
  achievements: string[];
  grades: {
    subject: string;
    grade: string;
  }[];
  progress: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  school: {
    type: String,
    required: [true, 'School is required']
  },
  interests: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
  grades: [{
    subject: {
      type: String,
      required: [true, 'Subject is required']
    },
    grade: {
      type: String,
      required: [true, 'Grade is required']
    }
  }],
  progress: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Pre-save hook to hash the password before saving a new user or updating password
UserSchema.pre<IUser>('save', async function(this: IUser, next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error: any) {
    next(error); // Pass any error to the next middleware
  }
});

// Method to compare candidate password with the hashed password in the database
UserSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;