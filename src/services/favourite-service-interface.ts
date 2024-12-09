import { OfferDocument } from '../models/offer.model.js';

export interface FavoriteServiceInterface {
  addFavorite(userId: string, offerId: string): Promise<void>;
  removeFavorite(userId: string, offerId: string): Promise<void>;
  getUserFavorites(userId: string): Promise<OfferDocument[]>;
}
