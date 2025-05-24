import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
}

const ChatSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IChat>('Chat', ChatSchema); 