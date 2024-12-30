import { UserServiceInterface } from './user-service-interface.js';
import UserModel, { UserDocument } from '../models/user.model.js';
import { injectable } from 'inversify';

@injectable()
export class UserService implements UserServiceInterface {
  public async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).exec();
  }

  public async create(userData: Partial<UserDocument>): Promise<UserDocument> {
    const user = new UserModel(userData);
    return user.save();
  }

  public async updateAvatar(userId: string, avatarPath: string): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { avatarUrl: avatarPath },
      { new: true }
    ).exec();
  }
}

