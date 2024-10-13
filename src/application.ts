import config from './config.js';
import { LoggerInterface } from './logger/logger-interface.js';
import { inject, injectable } from 'inversify';

@injectable()
export class Application {
  constructor(
    @inject('LoggerInterface') private logger: LoggerInterface
  ) {}

  public init() {
    const port = config.get('port');
    this.logger.info(`Приложение запустилось; порт db ${port}`);
  }
}
