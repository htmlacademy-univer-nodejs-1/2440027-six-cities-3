import fs from 'node:fs';
import chalk from 'chalk';
import { Offer } from '../types.js';


export function parseTSVLine(line: string): Offer | null {
  const values = line.split('\t');
  if (values.length !== 21) {
    console.error(chalk.red('Ошибка: Неверное количество полей в строке.'));
    return null;
  }

  const [
    title,
    description,
    date,
    city,
    previewImage,
    imagesStr,
    isPremiumStr,
    isFavoriteStr,
    ratingStr,
    type,
    bedroomsStr,
    maxAdultsStr,
    priceStr,
    goodsStr,
    hostName,
    hostEmail,
    hostAvatarUrl,
    hostIsProStr,
    commentsCountStr,
    latitudeStr,
    longitudeStr,
  ] = values;

  const offer: Offer = {
    title: title.replace(/(^"|"$)/g, ''),
    description: description.replace(/(^"|"$)/g, ''),
    date,
    city: city.replace(/(^"|"$)/g, '') as Offer['city'],
    previewImage,
    images: imagesStr.split(';'),
    isPremium: isPremiumStr === 'true',
    isFavorite: isFavoriteStr === 'true',
    rating: parseFloat(ratingStr),
    type: type as Offer['type'],
    bedrooms: parseInt(bedroomsStr, 10),
    maxAdults: parseInt(maxAdultsStr, 10),
    price: parseInt(priceStr, 10),
    goods: goodsStr.split(';'),
    host: {
      name: hostName.replace(/(^"|"$)/g, ''),
      email: hostEmail,
      avatarUrl: hostAvatarUrl,
      isPro: hostIsProStr === 'true',
    },
    commentsCount: parseInt(commentsCountStr, 10),
    latitude: parseFloat(latitudeStr),
    longitude: parseFloat(longitudeStr),
  };

  return offer;
}


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

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(chalk.red(`Ошибка при чтении файла: ${err.message}`));
          throw new Error('Error reading the file.');
        }

        const lines = data.trim().split('\n');
        const offers: Offer[] = [];

        for (const line of lines) {
          const offer = parseTSVLine(line);
          if (offer) {
            offers.push(offer);
          }
        }

        console.log(chalk.green(`Импортировано предложений: ${offers.length}`));
        console.log(offers);
      });
      break;
    }

    case '--generate':
      console.log(chalk.red('Команда --generate ещё не реализована.'));
      break;

    default:
      console.log(chalk.red('Неизвестная команда. Используйте --help для списка доступных команд.'));
      break;
  }
}

