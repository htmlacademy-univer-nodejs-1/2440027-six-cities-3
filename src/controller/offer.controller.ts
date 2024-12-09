import { Router, Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import asyncHandler from 'express-async-handler';
import { OfferServiceInterface } from '../services/offer-service-interface.js';
import { inject, injectable } from 'inversify';
import userModel from '../models/user.model.js';

@injectable()
export class OfferController extends Controller {
  public readonly router: Router;

  constructor(
    @inject('OfferServiceInterface') private offerService: OfferServiceInterface
  ) {
    super();
    this.router = Router();

    this.router.get('/:id', asyncHandler(this.getOffers.bind(this)));
    this.router.post('/', asyncHandler(this.createOffer.bind(this)));
  }

  private async getOffers(_req: Request, res: Response) {
    const offers = await this.offerService.findAll();
    this.ok(res, offers);
  }

  private async createOffer(req: Request, res: Response) {
    const offer = {
      ...req.body,
      publicationDate: new Date(),
      author: new userModel(), // TODO remove later
    };
    const newOffer = await this.offerService.create(offer);
    this.created(res, newOffer);
  }
}
