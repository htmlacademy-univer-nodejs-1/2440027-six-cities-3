import { Schema, model, Document, Types } from 'mongoose';

export interface OfferDocument extends Document {
  title: string;
  description: string;
  publicationDate: Date;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  author: Types.ObjectId;
  commentsCount: number;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<OfferDocument>(
  {
    title: { type: String, required: true, minlength: 10, maxlength: 100 },
    description: { type: String, required: true, minlength: 20, maxlength: 1024 },
    publicationDate: { type: Date, required: true },
    city: {
      type: String,
      required: true,
      enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
    },
    previewImage: { type: String, required: true },
    images: {
      type: [String],
      required: true,
      // validate: [(val: string[]) => val.length === 6, 'Должно быть ровно 6 фотографий'],
    },
    isPremium: { type: Boolean, required: true },
    isFavorite: { type: Boolean, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    type: { type: String, enum: ['apartment', 'house', 'room', 'hotel'], required: true },
    bedrooms: { type: Number, required: true, min: 1, max: 8 },
    maxAdults: { type: Number, required: true, min: 1, max: 10 },
    price: { type: Number, required: true, min: 100, max: 100000 },
    goods: { type: [String], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentsCount: { type: Number, default: 0 },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default model<OfferDocument>('Offer', offerSchema);
