import { Request, Response, NextFunction } from 'express';
import { ConflictError, BadRequestError } from '../errors/errors.js';
import { LoggerInterface } from '../logger/logger-interface.js';
import { inject, injectable } from 'inversify';

@injectable()
export class ErrorMiddleware {
  constructor(
    @inject('LoggerInterface') private logger: LoggerInterface
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public execute(err: any, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(err.message);

    if (err instanceof ConflictError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    if (err instanceof BadRequestError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }
}
