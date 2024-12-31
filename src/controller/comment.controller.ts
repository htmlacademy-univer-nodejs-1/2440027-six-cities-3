import { Controller } from '../controller/controller.js';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CommentServiceInterface } from '../services/comment-service-interface.js';
import { CreateCommentDTO } from '../dtos/comment.js';
import { ObjectIdMiddleware } from '../middleware/objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';
import { CheckEntityExistsMiddleware } from '../middleware/check-entity-exists.middleware.js';
import { OfferServiceInterface } from '../services/offer-service-interface.js';
import { AuthGuardMiddleware } from '../middleware/auth-guard.middleware.js';
import { AuthService } from '../services/auth.service.js';

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject('CommentServiceInterface') private commentService: CommentServiceInterface,
    @inject('OfferServiceInterface') private offerService: OfferServiceInterface,
    @inject('AuthServiceInterface') private authService: AuthService
  ) {
    super();
    this.addRoute({
      path: '/offers/:offerId/comments',
      method: 'get',
      handler: this.index,
      middlewares: [new ObjectIdMiddleware('offerId'), new CheckEntityExistsMiddleware('offerId', this.offerService, 'Offer')]
    });

    this.addRoute({
      path: '/offers/:offerId/comments',
      method: 'post',
      handler: this.create,
      middlewares: [
        new AuthGuardMiddleware(this.authService),
        new ObjectIdMiddleware('offerId'),
        new CheckEntityExistsMiddleware('offerId', this.offerService, 'Offer'),
        new ValidateDtoMiddleware(CreateCommentDTO),
      ]
    });
  }

  private async index(req: Request, res: Response) {
    const { offerId } = req.params;
    const comments = await this.commentService.findByOfferId(offerId, 50);
    this.ok(res, comments);
  }

  private async create(req: Request, res: Response) {
    const { offerId } = req.params;

    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }

    const dto = req.body as CreateCommentDTO;
    const comment = await this.commentService.create(offerId, userId, dto);
    this.created(res, comment);
  }
}
