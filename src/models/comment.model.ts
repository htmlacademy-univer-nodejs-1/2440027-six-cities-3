import { Schema, model, Document, Types } from 'mongoose';

export interface Comment extends Document {
  text: string;
  publicationDate: Date;
  rating: number;
  author: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<Comment>(
  {
    text: { type: String, required: true, minlength: 5, maxlength: 1024 },
    publicationDate: { type: Date, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offer: { type: Schema.Types.ObjectId, ref: 'Offer', required: true } // ссылка на оффер
  },
  { timestamps: true }
);

export default model<Comment>('Comment', commentSchema);
