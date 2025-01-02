import { UserServiceInterface } from './user-service-interface.js';
import UserModel, { UserDocument } from '../models/user.model.js';
import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { CreateUserDTO } from '../dtos/user.js';
import config from '../config.js';
import { ConflictError } from '../errors/errors.js';

@injectable()
export class UserService implements UserServiceInterface {
  public async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).exec();
  }

  public async create(dto: Partial<CreateUserDTO>): Promise<UserDocument> {
    const existingUser = await UserModel.findOne({ email: dto.email }).exec();
    if (existingUser) {
      throw new ConflictError('Пользователь с таким email уже существует.');
    }

    const SALT_ROUNDS = +config.get('salt')! || 10;
    const passwordHash = await bcrypt.hash(dto.password!, SALT_ROUNDS);

    const userData = {
      name: dto.name,
      email: dto.email,
      avatarUrl: dto.avatarUrl,
      passwordHash: passwordHash,
      userType: dto.userType
    };

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

