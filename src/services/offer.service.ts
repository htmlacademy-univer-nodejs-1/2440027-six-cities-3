// import { OfferServiceInterface } from './offer-service-interface.js';
// import OfferModel, { OfferDocument } from '../models/offer.model.js';
// import { injectable } from 'inversify';

// @injectable()
// export class OfferService implements OfferServiceInterface {
//   public async findById(id: string): Promise<OfferDocument | null> {
//     return OfferModel.findById(id).exec();
//   }

//   public async create(offerData: Partial<OfferDocument>): Promise<OfferDocument> {
//     const offer = new OfferModel(offerData);
//     return offer.save();
//   }
// }


import { OfferServiceInterface } from './offer-service-interface.js';
import OfferModel, { OfferDocument } from '../models/offer.model.js';
import CommentModel from '../models/comment.model.js';
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { UpdateOfferDTO } from '../dtos/offer.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  update(_id: string, _dto: UpdateOfferDTO): Promise<OfferDocument | null> {
    throw new Error('Method not implemented.');
  }

  deleteById(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findAll(_limit?: number, _city?: string, _sortByDate?: boolean): Promise<OfferDocument[]> {
    throw new Error('Method not implemented.');
  }

  findPremiumByCity(_city: string): Promise<OfferDocument[]> {
    throw new Error('Method not implemented.');
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
