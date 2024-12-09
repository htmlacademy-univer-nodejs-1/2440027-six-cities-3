import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export abstract class Controller {
  protected send(res: Response, statusCode: number, data?: unknown): void {
    res.status(statusCode).json(data);
  }

  protected ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  protected created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  protected noContent(res: Response): void {
    this.send(res, StatusCodes.NO_CONTENT);
  }

  protected badRequest(res: Response, message: string): void {
    this.send(res, StatusCodes.BAD_REQUEST, {error: message});
  }

  protected unauthorized(res: Response, message: string): void {
    this.send(res, StatusCodes.UNAUTHORIZED, {error: message});
  }

  protected forbidden(res: Response, message: string): void {
    this.send(res, StatusCodes.FORBIDDEN, {error: message});
  }

  protected notFound(res: Response, message: string): void {
    this.send(res, StatusCodes.NOT_FOUND, {error: message});
  }

  protected conflict(res: Response, message: string): void {
    this.send(res, StatusCodes.CONFLICT, {error: message});
  }
}
