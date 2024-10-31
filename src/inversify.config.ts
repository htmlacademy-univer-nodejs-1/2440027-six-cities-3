import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from './application.js';
import { LoggerInterface } from './logger/logger-interface.js';
import LoggerService from './logger/logger.service.js';
import { CliService } from './cli/cli-service.js';
import { DatabaseInterface } from './database/database-interface.js';
import { MongoDatabaseService } from './database/mongo-database.service.js';
import { OfferServiceInterface } from './services/offer-service-interface.js';
import { OfferService } from './services/offer.service.js';
import { UserServiceInterface } from './services/user-service-interface.js';
import { UserService } from './services/user.service.js';

const container = new Container();

container.bind<LoggerInterface>('LoggerInterface').to(LoggerService).inSingletonScope();
container.bind<Application>(Application).toSelf();
container.bind<CliService>(CliService).toSelf();
container.bind<DatabaseInterface>('DatabaseInterface').to(MongoDatabaseService).inSingletonScope();
container.bind<UserServiceInterface>('UserServiceInterface').to(UserService).inSingletonScope();
container.bind<OfferServiceInterface>('OfferServiceInterface').to(OfferService).inSingletonScope();

export default container;
