import mongoose from 'mongoose';
import { DatabaseInterface } from './database-interface.js';
import { LoggerInterface } from '../logger/logger-interface.js';
import { inject, injectable } from 'inversify';

@injectable()
export class MongoDatabaseService implements DatabaseInterface {
  constructor(
    @inject('LoggerInterface') private logger: LoggerInterface
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info(`Попытка подключения к MongoDB... ${uri}`);
    try {
      await mongoose.connect(uri);
      this.logger.info('Успешно подключились к MongoDB');
    } catch (error) {
      this.logger.error(`Ошибка подключения к MongoDB: ${(error as Error).message}`);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Отключились от MongoDB');
  }
}
