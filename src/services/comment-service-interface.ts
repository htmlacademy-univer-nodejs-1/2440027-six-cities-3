import { CreateCommentDTO } from '../dtos/comment.js';
import { Comment } from '../models/comment.model.js';

export interface CommentServiceInterface {
  create(offerId: string, userId: string, dto: CreateCommentDTO): Promise<Comment>;
  findByOfferId(offerId: string, limit?: number): Promise<Comment[]>;
}
