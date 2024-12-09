import chalk from 'chalk';
import { Offer } from '../types.js';
import { GoodType } from '../dtos/offer.js';

export function parseTSVLine(line: string): Offer | null {
  const values = line.split('\t');
  if (values.length !== 21) {
    console.error(chalk.red('Ошибка: Неверное количество полей в строке.'));
    return null;
  }

  const [
    title,
    description,
    publicationDate,
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
    publicationDate,
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
    goods: goodsStr.split(';') as GoodType[],
    author: {
      name: hostName.replace(/(^"|"$)/g, ''),
      email: hostEmail,
      avatarUrl: hostAvatarUrl,
      isPro: hostIsProStr === 'true',
      password: '1234567',
      userType: hostIsProStr === 'true' ? 'pro' : 'regular',
    },
    commentsCount: parseInt(commentsCountStr, 10),
    latitude: parseFloat(latitudeStr),
    longitude: parseFloat(longitudeStr),
  };

  return offer;
}

