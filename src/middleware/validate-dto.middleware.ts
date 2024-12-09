import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware-interface.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateDtoMiddleware<T extends object> implements MiddlewareInterface {
  constructor(private dtoClass: {new(): T}) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const messages = errors.map((err) => Object.values(err.constraints ?? {})).flat();
      res.status(400).json({error: messages});
      return;
    }

    next();
  }
}
