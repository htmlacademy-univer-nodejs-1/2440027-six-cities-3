import { Request, Response, NextFunction } from 'express';
import { LoggerInterface } from '../logger/logger-interface.js';
import { inject, injectable } from 'inversify';
import { HttpError } from './http-error.interface.js';

@injectable()
export class ExceptionFilter {
  constructor(@inject('LoggerInterface') private logger: LoggerInterface) {}

  public catch(err: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`Ошибка обработана: ${err.message}`);
    const statusCode = err.statusCode ?? 500;
    res.status(statusCode).json({error: err.message});
  }
}
