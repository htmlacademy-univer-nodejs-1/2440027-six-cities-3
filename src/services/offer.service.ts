import { OfferServiceInterface } from './offer-service-interface.js';
import OfferModel, { OfferDocument } from '../models/offer.model.js';
import { injectable } from 'inversify';

@injectable()
export class OfferService implements OfferServiceInterface {
  public async findById(id: string): Promise<OfferDocument | null> {
    return OfferModel.findById(id).exec();
  }

  public async create(offerData: Partial<OfferDocument>): Promise<OfferDocument> {
    const offer = new OfferModel(offerData);
    return offer.save();
  }
}
