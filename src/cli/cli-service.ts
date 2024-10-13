import fs from 'node:fs';
import chalk from 'chalk';
import readline from 'node:readline';
import { inject, injectable } from 'inversify';
import { parseTSVLine } from './parse-line.js';
import { generateOffers } from './generate-offers.js';
import { LoggerInterface } from '../logger/logger-interface.js';

@injectable()
export class CliService {
  constructor(
    @inject('LoggerInterface') private logger: LoggerInterface
  ) {}

  public runCli(args: string[]): void {
    const command = args[0];

    switch (command) {
      case '--help':
      case undefined:
        this.logger.info(chalk.green('Программа для подготовки данных для REST API сервера.\n'));
        this.logger.info('Пример: cli.ts --<command> [--arguments]\n');
        this.logger.info('Команды:\n');
        this.logger.info(chalk.yellow(' --version:                   # выводит номер версии'));
        this.logger.info(chalk.yellow(' --help:                      # печатает этот текст'));
        this.logger.info(chalk.yellow(' --import <path>:             # импортирует данные из TSV'));
        this.logger.info(chalk.yellow(' --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных'));
        break;

      case '--version': {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        this.logger.info(chalk.blue(packageJson.version));
        break;
      }

      case '--import': {
        const filePath = args[1];
        if (!filePath) {
          this.logger.error(chalk.red('Пожалуйста, укажите путь к файлу.'));
          throw new Error('File not found error. Please specify correct file');
        }

        const readStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: readStream });

        rl.on('line', (line: string) => {
          const offer = parseTSVLine(line);
          if (!offer){
            this.logger.info('Failed to parse line');
          }
        });

        rl.on('close', () => {
          this.logger.info(chalk.green('Импорт данных завершён.'));
        });

        rl.on('error', (err: Error) => {
          this.logger.error(chalk.red(`Ошибка при чтении файла: ${err.message}`));
        });
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
