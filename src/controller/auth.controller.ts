import { Router, Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import { AuthServiceInterface } from '../services/auth-service-interface.js';
import { inject, injectable } from 'inversify';
import { LoginDTO } from '../dtos/auth.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';

@injectable()
export class AuthController extends Controller {
  public readonly router: Router;

  constructor(
    @inject('AuthServiceInterface') private authService: AuthServiceInterface
  ) {
    super();
    this.router = Router();

    this.addRoute({
      path: '/login',
      method: 'post',
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginDTO)]
    });
    this.addRoute({
      path: '/logout',
      method: 'post',
      handler: this.logout,
      middlewares: []
    });
    this.addRoute({
      path: '/status',
      method: 'get',
      handler: this.status,
      middlewares: []
    });

  }

  private async login(req: Request, res: Response) {
    const dto = req.body as LoginDTO;
    try {
      const token = await this.authService.login(dto);
      this.ok(res, { token });
    } catch (err) {
      this.unauthorized(res, (err as Error).message);
    }
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
    this.ok(res, { id: user.id, email: user.email, name: user.name });
  }
}
