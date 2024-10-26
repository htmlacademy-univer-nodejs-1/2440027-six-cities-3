import { LoggerInterface } from './logger-interface.js';
import pino, { Logger } from 'pino';
import { injectable } from 'inversify';

@injectable()
export default class LoggerService implements LoggerInterface {
  private logger: Logger;

  constructor() {
    this.logger = pino();
  }

  info(message: string, ...params: unknown[]): void {
    this.logger.info(message, params);
  }

  warn(message: string, ...params: unknown[]): void {
    this.logger.warn(message, params);
  }

  debug(message: string, ...params: unknown[]): void {
    this.logger.debug(message, params);
  }

  trace(message: string, ...params: unknown[]): void {
    this.logger.trace(message, params);
  }

  error(message: string, ...params: unknown[]): void {
    this.logger.error(message, params);
  }
}
