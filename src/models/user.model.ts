import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  userType: 'regular' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 15 },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    password: { type: String, required: true, minlength: 6, maxlength: 12 },
    userType: { type: String, enum: ['regular', 'pro'], required: true },
  },
  { timestamps: true }
);

export default model<UserDocument>('User', userSchema);
