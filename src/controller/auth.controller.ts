import { Router, Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import asyncHandler from 'express-async-handler';
import { AuthServiceInterface } from '../services/auth-service-interface.js';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthController extends Controller {
  public readonly router: Router;

  constructor(
    @inject('AuthServiceInterface') private authService: AuthServiceInterface
  ) {
    super();
    this.router = Router();

    this.router.post('/login', asyncHandler(this.login.bind(this)));
    this.router.post('/logout', asyncHandler(this.logout.bind(this)));
    this.router.get('/status', asyncHandler(this.status.bind(this)));
  }

  private async login(req: Request, res: Response) {
    const dto = req.body;
    const token = await this.authService.login(dto);
    this.ok(res, {token});
  }

  private async logout(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return this.unauthorized(res, 'No token provided');
    }

    await this.authService.logout(token);
    this.noContent(res);
  }

  private async status(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return this.unauthorized(res, 'No token provided');
    }

    const user = await this.authService.verifyToken(token);
    if (!user) {
      return this.unauthorized(res, 'Invalid token');
    }

    this.ok(res, {id: user.id, email: user.email, name: user.name});
  }
}
