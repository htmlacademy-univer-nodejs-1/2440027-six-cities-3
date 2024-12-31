import { Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import { UserServiceInterface } from '../services/user-service-interface.js';
import { inject, injectable } from 'inversify';
import { CreateUserDTO } from '../dtos/user.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';
import { UploadFileMiddleware } from '../middleware/upload-file.middleware.js';
import { AuthGuardMiddleware } from '../middleware/auth-guard.middleware.js';
import { AuthService } from '../services/auth.service.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject('UserServiceInterface') private userService: UserServiceInterface,
    @inject('AuthServiceInterface') private authService: AuthService
  ) {
    super();

    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.createUser,
      middlewares: [new ValidateDtoMiddleware(CreateUserDTO)]
    });

    this.addRoute({
      path: '/avatar',
      method: 'post',
      handler: this.uploadAvatar,
      middlewares: [
        new AuthGuardMiddleware(this.authService),
        new UploadFileMiddleware('avatar'),
      ],
    });
  }

  private async createUser(req: Request, res: Response) {
    const dto = req.body as CreateUserDTO;
    const user = await this.userService.create(dto);
    this.created(res, {id: user.id, name: user.name, email: user.email});
  }

  private async uploadAvatar(req: Request, res: Response) {

    if (!req.file) {
      return this.badRequest(res, 'Файл не найден');
    }

    const userId = req.user?.id;
    if (!userId) {
      return this.unauthorized(res, 'Not authenticated');
    }

    const filePath = req.file.path;

    const updatedUser = await this.userService.updateAvatar(userId, filePath);

    if (!updatedUser) {
      return this.notFound(res, `Пользователь с id «${userId}» не найден`);
    }

    this.ok(res, {
      message: 'Avatar uploaded!',
      avatarPath: updatedUser.avatarUrl
    });
  }
}
