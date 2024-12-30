import config from './config.js';
import { DatabaseInterface } from './database/database-interface.js';
import { LoggerInterface } from './logger/logger-interface.js';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { OfferController } from './controller/offer.controller.js';
import { UserController } from './controller/user.controller.js';
import { OfferService } from './services/offer.service.js';
import { UserService } from './services/user.service.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'node:fs';
import { CommentController } from './controller/comment.controller.js';
import { CommentService } from './services/comment.service.js';
import path from 'node:path';


@injectable()
export class Application {
  private expressApp: Express;
  private offerController: OfferController;
  private userController: UserController;
  private commentController: CommentController;

  constructor(
    @inject('LoggerInterface') private logger: LoggerInterface,
    @inject('DatabaseInterface') private database: DatabaseInterface,
    @inject('OfferServiceInterface') private offerService: OfferService,
    @inject('UserServiceInterface') private userService: UserService,
    @inject('CommentServiceInterface') private commentService: CommentService
  ) {
    this.expressApp = express();

    this.offerController = new OfferController(this.offerService);
    this.userController = new UserController(this.userService);
    this.commentController = new CommentController(this.commentService, this.offerService);
  }

  private registerMiddlewares() {
    this.expressApp.use(express.json());
  }

  private registerRoutes() {
    this.expressApp.use('/offers', this.offerController.getRouter());
    this.expressApp.use('/users', this.userController.getRouter());
    this.expressApp.use('/', this.commentController.getRouter()); //  /offers/:offerId/comments


    const yamlFile = fs.readFileSync('./specification/specification.yml', 'utf8');
    const swaggerDocument = YAML.parse(yamlFile);

    this.expressApp.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  }

  private registerStatic() {
    const uploadsDir = config.get('uploadsDirectory');
    this.expressApp.use('/static', express.static(path.resolve(uploadsDir)));
  }

  public async init() {
    const port = config.get('port');
    this.logger.info(`Приложение запустилось; порт сервера ${port}`);

    const dbUri = config.get('dbUri');
    await this.database.connect(dbUri);

    this.registerMiddlewares();
    this.registerRoutes();
    this.registerStatic();

    this.expressApp.listen(port, () => {
      this.logger.info(`Сервер запущен на порту ${port}`);
    });
  }
}
