import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware-interface.js';
import { AuthServiceInterface } from '../services/auth-service-interface.js';

export class AuthGuardMiddleware implements MiddlewareInterface {
  constructor(private authService: AuthServiceInterface) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Invalid Authorization header' });
      return;
    }
    const user = await this.authService.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = user;
    return next();
  }
}
