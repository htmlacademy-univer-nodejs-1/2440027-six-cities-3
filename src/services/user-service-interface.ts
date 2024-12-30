import { CreateUserDTO } from '../dtos/user.js';
import {UserDocument} from '../models/user.model.js';

export interface UserServiceInterface {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(dto: CreateUserDTO): Promise<UserDocument>;
  updateAvatar(userId: string, avatarPath: string): Promise<UserDocument | null>;
}
