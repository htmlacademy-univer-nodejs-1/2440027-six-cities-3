import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from './application.js';
import { LoggerInterface } from './logger/logger-interface.js';
import LoggerService from './logger/logger.service.js';
import { CliService } from './cli/cli-service.js';

const container = new Container();

container.bind<LoggerInterface>('LoggerInterface').to(LoggerService).inSingletonScope();
container.bind<Application>(Application).toSelf();
container.bind<CliService>(CliService).toSelf();

export default container;
