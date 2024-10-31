export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
  password: string;
  userType: 'regular' | 'pro';
}

export interface Offer {
  title: string;
  description: string;
  publicationDate: string;
  city: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: 'apartment' | 'house' | 'room' | 'hotel';
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  author: User;
  commentsCount: number;
  latitude: number;
  longitude: number;
}
