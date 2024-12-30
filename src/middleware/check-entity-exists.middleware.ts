import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware-interface.js';
import { EntityServiceInterface } from '../services/entity-service-interface.js';


export class CheckEntityExistsMiddleware<EntityType> implements MiddlewareInterface {
  constructor(
    private readonly paramName: string,
    private readonly service: EntityServiceInterface<EntityType>,
    private readonly entityName: string
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params[this.paramName];

    try {
      const entity = await this.service.findById(id);

      if (!entity) {
        res.status(404).json({ error: `${this.entityName} с id «${id}» не найден` });
        return;
      }

      //
      // (req as any).entity = entity;
      //
      // но это опционально

      return next();

    } catch (err) {
      return next(err);
    }
  }
}
