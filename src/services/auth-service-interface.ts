import { LoginDTO } from '../dtos/auth.js';
import { UserDocument } from '../models/user.model.js';

export interface AuthServiceInterface {
  login(dto: LoginDTO): Promise<string>; // JWT
  verifyToken(token: string): Promise<UserDocument | null>;
  logout(token: string): Promise<void>;
}
