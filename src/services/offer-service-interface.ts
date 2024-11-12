import { OfferDocument } from '../models/offer.model.js';

export interface OfferServiceInterface {
  findById(id: string): Promise<OfferDocument | null>;
  create(offerData: Partial<OfferDocument>): Promise<OfferDocument>;
}
