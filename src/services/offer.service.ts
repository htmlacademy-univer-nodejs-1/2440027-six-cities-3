import { OfferServiceInterface } from './offer-service-interface.js';
import OfferModel, { OfferDocument } from '../models/offer.model.js';
import CommentModel from '../models/comment.model.js';
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { UpdateOfferDTO } from '../dtos/offer.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  public async update(id: string, dto: UpdateOfferDTO): Promise<OfferDocument | null> {
    return OfferModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  public async deleteById(id: string): Promise<void> {
    await OfferModel.findByIdAndDelete(id).exec();

    await CommentModel.deleteMany({ offer: id }).exec();
  }

  public async findAll(limit?: number, city?: string, sortByDate?: boolean): Promise<OfferDocument[]> {
    const query = OfferModel.find();

    if (city) {
      query.where('city').equals(city);
    }

    if (sortByDate) {
      query.sort({ publicationDate: -1 });
    }

    if (limit) {
      query.limit(limit);
    } else {
      query.limit(60);
    }

    return query.exec();
  }

  public async findPremiumByCity(city: string): Promise<OfferDocument[]> {
    return OfferModel.find({ city, isPremium: true })
      .sort({ publicationDate: -1 })
      .limit(3)
      .exec();
  }

  public async findById(id: string): Promise<OfferDocument | null> {
    return OfferModel.findById(id).exec();
  }

  public async create(offerData: Partial<OfferDocument>): Promise<OfferDocument> {
    const offer = new OfferModel(offerData);
    return offer.save();
  }

  public async recalculateRatingAndCommentsCount(offerId: string): Promise<void> {
    const offerObjectId = new Types.ObjectId(offerId);

    const result = await CommentModel.aggregate([
      { $match: { offer: offerObjectId } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const commentsCount = result.length > 0 ? result[0].count : 0;
    const avgRating = result.length > 0 ? result[0].avgRating : 0;

    await OfferModel.findByIdAndUpdate(offerId, {
      commentsCount: commentsCount,
      rating: avgRating
    }).exec();
  }
}
