import {UserDocument} from '../models/user.model.js';

export interface UserServiceInterface {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(userData: Partial<UserDocument>): Promise<UserDocument>;
}
