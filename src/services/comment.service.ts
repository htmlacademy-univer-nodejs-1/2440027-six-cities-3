
import CommentModel, { Comment } from '../models/comment.model.js';

import { injectable, inject } from 'inversify';
import { CommentServiceInterface } from './comment-service-interface.js';
import { CreateCommentDTO } from '../dtos/comment.js';
import { OfferServiceInterface } from './offer-service-interface.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject('OfferServiceInterface') private offerService: OfferServiceInterface
  ) {}

  public async create(offerId: string, userId: string, dto: CreateCommentDTO): Promise<Comment> {
    const comment = new CommentModel({
      ...dto,
      publicationDate: new Date(),
      author: userId,
      offer: offerId
    });
    const savedComment = await comment.save();

    await this.offerService.recalculateRatingAndCommentsCount(offerId);

    return savedComment;
  }

  public async findByOfferId(offerId: string, limit = 50): Promise<Comment[]> {
    return CommentModel.find({ offer: offerId }).sort({ publicationDate: -1 }).limit(limit).exec();
  }
}
