import fs from 'node:fs';
import chalk from 'chalk';
import readline from 'node:readline';

import { parseTSVLine } from './parse-line.js';
import { generateOffers } from './generate-offers.js';


export function runCli(args: string[]): void {
  const command = args[0];

  switch (command) {
    case '--help':
    case undefined:
      console.log(chalk.green('Программа для подготовки данных для REST API сервера.\n'));
      console.log('Пример: cli.ts --<command> [--arguments]\n');
      console.log('Команды:\n');
      console.log(chalk.yellow(' --version:                   # выводит номер версии'));
      console.log(chalk.yellow(' --help:                      # печатает этот текст'));
      console.log(chalk.yellow(' --import <path>:             # импортирует данные из TSV'));
      console.log(chalk.yellow(' --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных'));
      break;

    case '--version': {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      console.log(chalk.blue(packageJson.version));
      break;
    }

    case '--import': {
      const filePath = args[1];
      if (!filePath) {
        console.error(chalk.red('Пожалуйста, укажите путь к файлу.'));
        throw new Error('File not found error. Please specify correct file');
      }

      const readStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: readStream });

      rl.on('line', (line: string) => {
        const offer = parseTSVLine(line);
        if (!offer){
          console.log('Failed to parse line');
        }
      });

      rl.on('close', () => {
        console.log(chalk.green('Импорт данных завершён.'));
      });

      rl.on('error', (err: Error) => {
        console.error(chalk.red(`Ошибка при чтении файла: ${err.message}`));
      });
      break;
    }

    case '--generate':{
      const n = parseInt(args[1], 10);
      const filepath = args[2];
      const url = args[3];

      if (!n || !filepath || !url) {
        console.error(chalk.red('Пожалуйста, укажите все необходимые аргументы: <n> <path> <url>'));
        throw new Error('Missing arguments for generate command');
      }

      generateOffers(n, filepath, url);
      break;
    }

    default:
      console.log(chalk.red('Неизвестная команда. Используйте --help для списка доступных команд.'));
      break;
  }
}

