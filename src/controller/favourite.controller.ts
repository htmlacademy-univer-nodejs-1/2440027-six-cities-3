// import { Router, Request, Response } from 'express';
import { Router } from 'express';

import { Controller } from '../controller/controller.js';
// import asyncHandler from 'express-async-handler';
import { injectable } from 'inversify';

@injectable()
export class FavoriteController extends Controller {
  public readonly router: Router;

  constructor(
  ) {
    super();
    this.router = Router();

    // this.router.get('/', asyncHandler(this.getFavorites.bind(this)));
    // this.router.post('/:offerId', asyncHandler(this.addFavorite.bind(this)));
    // this.router.delete('/:offerId', asyncHandler(this.removeFavorite.bind(this)));
  }

  //   private async getFavorites(req: Request, res: Response) {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       return this.unauthorized(res, 'Not authenticated');
  //     }
  //     const offers = await this.favoriteService.getUserFavorites(userId);
  //     this.ok(res, offers);
  //   }

  //   private async addFavorite(req: Request, res: Response) {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       return this.unauthorized(res, 'Not authenticated');
  //     }

  //     const { offerId } = req.params;
  //     await this.favoriteService.addFavorite(userId, offerId);
  //     this.ok(res, { message: `Offer ${offerId} added to favorites` });
  //   }

  //   private async removeFavorite(req: Request, res: Response) {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       return this.unauthorized(res, 'Not authenticated');
  //     }

//     const { offerId } = req.params;
//     await this.favoriteService.removeFavorite(userId, offerId);
//     this.ok(res, { message: `Offer ${offerId} removed from favorites` });
//   }
}
