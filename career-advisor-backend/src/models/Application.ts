import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  university: string;
  program: string;
  deadline: Date;
  status: 'pending' | 'submitted' | 'accepted' | 'rejected';
  progress: number;
  requirements: {
    name: string;
    completed: boolean;
  }[];
}

const ApplicationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  university: { type: String, required: true },
  program: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'accepted', 'rejected'],
    default: 'pending'
  },
  progress: { type: Number, default: 0 },
  requirements: [{
    name: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IApplication>('Application', ApplicationSchema); 