import { Router, Request, Response } from 'express';
import { Controller } from '../controller/controller.js';
import asyncHandler from 'express-async-handler';
import { UserServiceInterface } from '../services/user-service-interface.js';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController extends Controller {
  public readonly router: Router;

  constructor(
    @inject('UserServiceInterface') private userService: UserServiceInterface
  ) {
    super();
    this.router = Router();

    this.router.post('/', asyncHandler(this.createUser.bind(this)));
  }

  private async createUser(req: Request, res: Response) {
    const dto = req.body;
    const user = await this.userService.create(dto);
    this.created(res, {id: user.id, name: user.name, email: user.email});
  }
}
