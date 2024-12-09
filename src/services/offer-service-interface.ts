import { CreateOfferDTO, UpdateOfferDTO } from '../dtos/offer.js';
import { OfferDocument } from '../models/offer.model.js';

export interface OfferServiceInterface {
  findById(id: string): Promise<OfferDocument | null>;
  create(dto: CreateOfferDTO): Promise<OfferDocument>;
  update(id: string, dto: UpdateOfferDTO): Promise<OfferDocument | null>;
  deleteById(id: string): Promise<void>;
  findAll(limit?: number, city?: string, sortByDate?: boolean): Promise<OfferDocument[]>;
  findPremiumByCity(city: string): Promise<OfferDocument[]>;
  recalculateRatingAndCommentsCount(offerId: string): Promise<void>;
}
