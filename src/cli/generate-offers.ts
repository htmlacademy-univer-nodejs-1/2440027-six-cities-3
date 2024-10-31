import fs from 'node:fs';
import axios from 'axios';
import chalk from 'chalk';
import { Offer } from '../types.js';
import { getRandomElement } from './utils.js';


function generateRandomOffer(baseOffer: Offer): Offer {
  return {
    ...baseOffer,
    title: `${baseOffer.title} - ${Math.floor(Math.random() * 100)}`,
    price: 100 + Math.floor(Math.random() * 1000),
    bedrooms: Math.floor(Math.random() * 5) + 1,
    maxAdults: Math.floor(Math.random() * 6) + 1,
    rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
    latitude: baseOffer.latitude + (Math.random() - 0.5) * 0.1,
    longitude: baseOffer.longitude + (Math.random() - 0.5) * 0.1
  };
}

export async function generateOffers(n: number, filepath: string, url: string): Promise<void> {
  try {
    const response = await axios.get<Offer[]>(url);
    const baseOffers = response.data;

    const offers: Offer[] = [];
    for (let i = 0; i < n; i++) {
      const randomBaseOffer = getRandomElement(baseOffers);
      const newOffer = generateRandomOffer(randomBaseOffer);
      offers.push(newOffer);
    }
    console.log(offers[0].author);

    const tsvData = offers
      .map((offer) => [
        offer.title,
        offer.description,
        offer.publicationDate,
        offer.city,
        offer.previewImage,
        offer.images.join(';'),
        offer.isPremium,
        offer.isFavorite,
        offer.rating,
        offer.type,
        offer.bedrooms,
        offer.maxAdults,
        offer.price,
        offer.goods.join(';'),
        offer.author.name,
        offer.author.email,
        offer.author.avatarUrl,
        offer.author.isPro,
        offer.commentsCount,
        offer.latitude,
        offer.longitude
      ].join('\t'))
      .join('\n');

    const writeStream = fs.createWriteStream(filepath);
    writeStream.write(tsvData);
    writeStream.end();

    console.log(chalk.green(`Файл с тестовыми данными успешно создан: ${filepath}`));
  } catch (error) {
    console.error(chalk.red(`Ошибка при генерации данных: ${error}`));
  }
}
