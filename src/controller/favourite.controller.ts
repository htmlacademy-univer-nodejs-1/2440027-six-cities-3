import { Request, Response } from 'express';

import { Controller } from '../controller/controller.js';
import { inject, injectable } from 'inversify';
import { ObjectIdMiddleware } from '../middleware/objectid.middleware.js';
import { AuthGuardMiddleware } from '../middleware/auth-guard.middleware.js';
import { FavoriteServiceInterface } from '../services/favourite-service-interface.js';
import { AuthService } from '../services/auth.service.js';


@injectable()
export class FavoriteController extends Controller {
  constructor(
    @inject('FavoriteServiceInterface') private favoriteService: FavoriteServiceInterface,
    @inject('AuthServiceInterface') private authService: AuthService
  ) {
    super();

    this.addRoute({
      path: '/',
      method: 'get',
      handler: this.getFavorites,
      middlewares: [
        new AuthGuardMiddleware(this.authService)
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: 'post',
      handler: this.addFavorite,
      middlewares: [
        new AuthGuardMiddleware(this.authService),
        new ObjectIdMiddleware('offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: 'delete',
      handler: this.removeFavorite,
      middlewares: [
        new AuthGuardMiddleware(this.authService),
        new ObjectIdMiddleware('offerId')
      ]
    });
  }

  private async addFavorite(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }

    const { offerId } = req.params;

    await this.favoriteService.addFavorite(userId, offerId);
    this.ok(res, { message: `Offer ${offerId} added to favorites` });
  }

  private async removeFavorite(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }

    const { offerId } = req.params;
    await this.favoriteService.removeFavorite(userId, offerId);
    this.ok(res, { message: `Offer ${offerId} removed from favorites` });
  }

  private async getFavorites(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }

    const offers = await this.favoriteService.getUserFavorites(userId);
    this.ok(res, offers);
  }
}
