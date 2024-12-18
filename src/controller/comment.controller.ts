import { Controller } from '../controller/controller.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CommentServiceInterface } from '../services/comment-service-interface.js';
import { CreateCommentDTO } from '../dtos/comment.js';
import { ObjectIdMiddleware } from '../middleware/objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject('CommentServiceInterface') private commentService: CommentServiceInterface
  ) {
    super();
    this.addRoute({
      path: '/offers/:offerId/comments',
      method: 'get',
      handler: this.index,
      middlewares: [new ObjectIdMiddleware('offerId')]
    });

    this.addRoute({
      path: '/offers/:offerId/comments',
      method: 'post',
      handler: this.create,
      middlewares: [new ObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(CreateCommentDTO)]
    });
  }

  private async index(req: Request, res: Response) {
    const { offerId } = req.params;
    const comments = await this.commentService.findByOfferId(offerId, 50);
    this.ok(res, comments);
  }

  private async create(req: Request, res: Response) {
    const { offerId } = req.params;
    const userId = 'mocked-user-id';
    const dto = req.body as CreateCommentDTO;
    const comment = await this.commentService.create(offerId, userId, dto);
    this.created(res, comment);
  }
}
