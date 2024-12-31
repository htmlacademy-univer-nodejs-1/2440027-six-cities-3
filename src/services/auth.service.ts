import { AuthServiceInterface } from './auth-service-interface.js';
import { UserServiceInterface } from './user-service-interface.js';
import { inject, injectable } from 'inversify';
import { LoginDTO } from '../dtos/auth.js';
import { UserDocument } from '../models/user.model.js';
import { createSecretKey } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import config from '../config.js';

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject('UserServiceInterface') private userService: UserServiceInterface
  ) {}

  public async login(dto: LoginDTO): Promise<string> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials');
    }

    const secret = createSecretKey(config.get('jwtSecret'), 'utf-8');
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret);

    return token;
  }

  public async verifyToken(token: string): Promise<UserDocument | null> {
    try {
      const secret = createSecretKey(config.get('jwtSecret'), 'utf-8');
      const { payload } = await jwtVerify(token, secret);

      if (!payload.userId) {
        return null;
      }

      const user = await this.userService.findById(payload.userId as string);
      return user;
    } catch (err) {
      return null;
    }
  }

  public async logout(_token: string): Promise<void> {
    // Для JWT без сессий можно оставить пустым,
    // или реализовать список "протухших" токенов в БД/кеше
  }
}
