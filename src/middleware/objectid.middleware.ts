import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware-interface.js';
import { isValidObjectId } from 'mongoose';

export class ObjectIdMiddleware implements MiddlewareInterface {
  constructor(private paramName: string) {}

  public execute(req: Request, res: Response, next: NextFunction): void {
    const id = req.params[this.paramName];
    if (!isValidObjectId(id)) {
      res.status(400).json({error: `Invalid ${this.paramName} parameter`});
      return;
    }
    next();
  }
}
