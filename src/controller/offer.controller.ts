import { Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import { OfferServiceInterface } from '../services/offer-service-interface.js';
import { inject, injectable } from 'inversify';
import { Cities, CityType, CreateOfferDTO, UpdateOfferDTO } from '../dtos/offer.js';
import { ObjectIdMiddleware } from '../middleware/objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';
import { AuthService } from '../services/auth.service.js';
import { AuthGuardMiddleware } from '../middleware/auth-guard.middleware.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject('OfferServiceInterface') private offerService: OfferServiceInterface,
    @inject('AuthServiceInterface') private authService: AuthService
  ) {
    super();
    this.addRoute({
      path: '/premium/:city',
      method: 'get',
      handler: this.getPremiumOffers,
      middlewares: []
    });

    this.addRoute({
      path: '/:id',
      method: 'get',
      handler: this.getOfferById,
      middlewares: []
    });

    this.addRoute({
      path: '/',
      method: 'get',
      handler: this.getOffers,
      middlewares: []
    });

    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.createOffer,
      middlewares: [new AuthGuardMiddleware(this.authService), new ValidateDtoMiddleware(CreateOfferDTO)]
    });

    this.addRoute({
      path: '/:offerId',
      method: 'patch',
      handler: this.updateOffer,
      middlewares: [new AuthGuardMiddleware(this.authService), new ObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDTO)]
    });

    this.addRoute({
      path: '/:offerId',
      method: 'delete',
      handler: this.deleteOffer,
      middlewares: [
        new AuthGuardMiddleware(this.authService),
        new ObjectIdMiddleware('offerId')
      ]
    });
  }

  private async getOffers(_req: Request, res: Response) {
    const offers = await this.offerService.findAll();
    this.ok(res, offers);
  }

  private async getOfferById(req: Request, res: Response) {
    const { id } = req.params;
    const offer = await this.offerService.findById(id);
    if (!offer) {
      return this.notFound(res, 'Offer not found');
    }
    this.ok(res, offer);
  }

  private async createOffer(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }

    const dto = req.body as CreateOfferDTO;

    const offerData = {
      ...dto,
      publicationDate: new Date(),
      author: userId
    };
    const newOffer = await this.offerService.create(offerData);
    this.created(res, newOffer);
  }

  private async updateOffer(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }

    const { offerId } = req.params;

    const existingOffer = await this.offerService.findById(offerId);
    if (!existingOffer) {
      return this.notFound(res, 'Offer not found');
    }
    if (existingOffer.author.toString() !== userId) {
      return this.forbidden(res, 'You can update only your own offers');
    }

    const dto = req.body as UpdateOfferDTO;
    const updatedOffer = await this.offerService.update(offerId, {
      ...dto
    });
    this.ok(res, updatedOffer);
  }

  private async deleteOffer(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }
    const { offerId } = req.params;
    const existingOffer = await this.offerService.findById(offerId);
    if (!existingOffer) {
      return this.notFound(res, 'Offer not found');
    }
    if (existingOffer.author.toString() !== userId) {
      return this.forbidden(res, 'You can delete only your own offers');
    }
    await this.offerService.deleteById(offerId);
    return this.noContent(res);
  }

  private async getPremiumOffers(req: Request, res: Response) {
    const { city } = req.params;

    if (!city) {
      return this.badRequest(res, 'city query parameter is required');
    }

    if (!Cities.includes(city as CityType)) {
      return this.badRequest(res, `Invalid city "${city}". Must be one of: ${Cities.join(', ')}`);
    }

    const offers = await this.offerService.findPremiumByCity(city);

    const result = offers.map((offer) => ({
      price: offer.price,
      title: offer.title,
      type: offer.type,
      isFavorite: false,
      publicationDate: offer.publicationDate,
      city: offer.city,
      previewImage: offer.previewImage,
      isPremium: offer.isPremium,
      rating: offer.rating,
      commentsCount: offer.commentsCount
    }));
    this.ok(res, result);
  }
}
