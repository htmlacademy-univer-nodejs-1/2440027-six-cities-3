import fs from 'node:fs';
import chalk from 'chalk';
import readline from 'node:readline';
import { inject, injectable } from 'inversify';
import { parseTSVLine } from './parse-line.js';
import { generateOffers } from './generate-offers.js';
import { LoggerInterface } from '../logger/logger-interface.js';
import { DatabaseInterface } from '../database/database-interface.js';
import { OfferServiceInterface } from '../services/offer-service-interface.js';
import { UserServiceInterface } from '../services/user-service-interface.js';
import { UserType } from '../dtos/user.js';
import { GoodType } from '../dtos/offer.js';

@injectable()
export class CliService {
  constructor(
    @inject('LoggerInterface') private logger: LoggerInterface,
    @inject('DatabaseInterface') private database: DatabaseInterface,
    @inject('UserServiceInterface') private userService: UserServiceInterface,
    @inject('OfferServiceInterface') private offerService: OfferServiceInterface
  ) {}

  public async runCli(args: string[]): Promise<void> {
    const command = args[0];

    switch (command) {
      case '--help':
      case undefined:
        this.logger.info(chalk.green('Программа для подготовки данных для REST API сервера.\n'));
        this.logger.info('Пример: cli.ts --<command> [--arguments]\n');
        this.logger.info('Команды:\n');
        this.logger.info(chalk.yellow(' --version:                   # выводит номер версии'));
        this.logger.info(chalk.yellow(' --help:                      # печатает этот текст'));
        this.logger.info(chalk.yellow(' --import <path> <dbUri>:             # импортирует данные из TSV'));
        this.logger.info(chalk.yellow(' --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных'));
        break;

      case '--version': {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        this.logger.info(chalk.blue(packageJson.version));
        break;
      }

      case '--import': {
        const filePath = args[1];
        const dbUri = args[2];
        if (!filePath || !dbUri) {
          this.logger.error(chalk.red('Пожалуйста, укажите путь к файлу и строку подключения к бд'));
          throw new Error('Не указаны необходимые аргументы');
        }

        await this.database.connect(dbUri);

        const readStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: readStream });

        for await (const line of rl) {
          const offerData = parseTSVLine(line);
          if (!offerData) {
            this.logger.info('Не удалось разобрать строку.');
            continue;
          }

          let user = await this.userService.findByEmail(offerData.author.email);
          if (!user) {
            user = await this.userService.create({
              name: offerData.author.name,
              email: offerData.author.email,
              avatarUrl: offerData.author.avatarUrl,
              userType: offerData.author.isPro ? UserType.Pro : UserType.Regular,
              password: offerData.author.password || 'default_password',
            });
          }

          const offerForDb = {
            title: offerData.title,
            description: offerData.description,
            publicationDate: new Date(offerData.publicationDate),
            city: offerData.city,
            previewImage: offerData.previewImage,
            images: offerData.images,
            isPremium: offerData.isPremium,
            isFavorite: offerData.isFavorite,
            rating: offerData.rating,
            type: offerData.type,
            bedrooms: offerData.bedrooms,
            maxAdults: offerData.maxAdults,
            price: offerData.price,
            goods: offerData.goods as GoodType[],
            author: user,
            location: {
              latitude: offerData.latitude,
              longitude: offerData.longitude,
            },
          };

          await this.offerService.create(offerForDb);
        }

        this.logger.info(chalk.green('Импорт данных завершён.'));
        await this.database.disconnect();

        break;
      }

      case '--generate':{
        const n = parseInt(args[1], 10);
        const filepath = args[2];
        const url = args[3];

        if (!n || !filepath || !url) {
          this.logger.error(chalk.red('Пожалуйста, укажите все необходимые аргументы: <n> <path> <url>'));
          throw new Error('Missing arguments for generate command');
        }

        generateOffers(n, filepath, url);
        break;
      }

      default:
        this.logger.info(chalk.red('Неизвестная команда. Используйте --help для списка доступных команд.'));
        break;
    }
  }
}
