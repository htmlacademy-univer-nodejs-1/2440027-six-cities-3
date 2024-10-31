import config from './config.js';
import { DatabaseInterface } from './database/database-interface.js';
import { LoggerInterface } from './logger/logger-interface.js';
import { inject, injectable } from 'inversify';

@injectable()
export class Application {
  constructor(
    @inject('LoggerInterface') private logger: LoggerInterface,
    @inject('DatabaseInterface') private database: DatabaseInterface
  ) {}

  public async init() {
    const port = config.get('port');
    this.logger.info(`Приложение запустилось; порт db ${port}`);

    const dbUri = config.get('dbUri');
    await this.database.connect(dbUri);
  }
}
