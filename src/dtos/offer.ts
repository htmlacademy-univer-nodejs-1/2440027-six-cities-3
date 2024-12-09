export interface CreateOfferDTO {
    title: string;
    description: string;
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
    location: {
      latitude: number;
      longitude: number;
    };
    authorId: string;
  }

export interface UpdateOfferDTO {
    title?: string;
    description?: string;
    city?: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
    previewImage?: string;
    images?: string[];
    isPremium?: boolean;
    isFavorite?: boolean;
    rating?: number;
    type?: 'apartment' | 'house' | 'room' | 'hotel';
    bedrooms?: number;
    maxAdults?: number;
    price?: number;
    goods?: string[];
    location?: {
      latitude: number;
      longitude: number;
    };
  }
