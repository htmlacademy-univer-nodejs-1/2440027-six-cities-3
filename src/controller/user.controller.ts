import { Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import { UserServiceInterface } from '../services/user-service-interface.js';
import { inject, injectable } from 'inversify';
import { CreateUserDTO } from '../dtos/user.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject('UserServiceInterface') private userService: UserServiceInterface
  ) {
    super();

    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.createUser,
      middlewares: [new ValidateDtoMiddleware(CreateUserDTO)]
    });
  }

  private async createUser(req: Request, res: Response) {
    const dto = req.body as CreateUserDTO;
    const user = await this.userService.create(dto);
    this.created(res, {id: user.id, name: user.name, email: user.email});
  }
}
