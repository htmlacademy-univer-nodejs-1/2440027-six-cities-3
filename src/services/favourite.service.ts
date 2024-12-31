import { FavoriteServiceInterface } from './favourite-service-interface.js';
import { OfferDocument } from '../models/offer.model.js';

import OfferModel from '../models/offer.model.js';
import { injectable } from 'inversify';
import FavoriteModel from '../models/favourite.model.js';

@injectable()
export class FavoriteService implements FavoriteServiceInterface {
  constructor(
  ) {}

  public async addFavorite(userId: string, offerId: string): Promise<void> {
    const existing = await FavoriteModel.findOne({ userId, offerId }).exec();
    if (!existing) {
      await FavoriteModel.create({ userId, offerId });
    }
  }

  public async removeFavorite(userId: string, offerId: string): Promise<void> {
    await FavoriteModel.findOneAndDelete({ userId, offerId }).exec();
  }

  public async getUserFavorites(userId: string): Promise<OfferDocument[]> {
    const favoriteDocs = await FavoriteModel.find({ userId }).exec();
    const offerIds = favoriteDocs.map((f) => f.offerId);

    const offers = await OfferModel.find({ _id: { $in: offerIds } })
      .populate('author')
      .exec();

    return offers;
  }
}
