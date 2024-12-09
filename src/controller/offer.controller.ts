import { Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import { OfferServiceInterface } from '../services/offer-service-interface.js';
import { inject, injectable } from 'inversify';
import { CreateOfferDTO, UpdateOfferDTO } from '../dtos/offer.js';
import { ObjectIdMiddleware } from '../middleware/objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject('OfferServiceInterface') private offerService: OfferServiceInterface
  ) {
    super();
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
      middlewares: [new ValidateDtoMiddleware(CreateOfferDTO), new ObjectIdMiddleware('authorId')]
    });

    this.addRoute({
      path: '/:offerId',
      method: 'patch',
      handler: this.updateOffer,
      middlewares: [new ObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDTO)]
    });
  }

  private async getOffers(_req: Request, res: Response) {
    const offers = await this.offerService.findAll();
    this.ok(res, offers);
  }

  private async getOfferById(req: Request, res: Response) {
    const offer = await this.offerService.findById(req.body.id);
    this.ok(res, offer);
  }

  private async createOffer(req: Request, res: Response) {
    const offer = {
      ...req.body,
      publicationDate: new Date(),
      author: req.body.authorId
      // author: new userModel(), // TODO remove later
    };
    const newOffer = await this.offerService.create(offer);
    this.created(res, newOffer);
  }

  private async updateOffer(req: Request, res: Response) {
    const offer = {
      ...req.body,
      publicationDate: new Date(),
    };
    const updatedOffer = await this.offerService.update(offer.id, offer);
    this.ok(res, updatedOffer);
  }

}
