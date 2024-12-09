import { Request, Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../middleware/middleware-interface.js';
import asyncHandler from 'express-async-handler';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface RouteDefinition {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response) => Promise<void>;
  middlewares?: MiddlewareInterface[];
}

export abstract class Controller {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  public getRouter(): Router {
    return this.router;
  }

  protected addRoute({ path, method, handler, middlewares = [] }: RouteDefinition) {
    const routeHandler = asyncHandler(handler.bind(this));
    const chain = middlewares.map((m) => m.execute.bind(m));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.router as any)[method](path, ...chain, routeHandler);
  }

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

