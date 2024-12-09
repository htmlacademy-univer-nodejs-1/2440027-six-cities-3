import {
  IsString, Length, IsBoolean, IsNumber, IsEnum, IsInt, Min, Max, IsArray, ArrayMinSize,
  ValidateNested, IsNotEmpty,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';

const Cities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;
type CityType = typeof Cities[number];

const OfferTypes = ['apartment', 'house', 'room', 'hotel'] as const;
type OfferType = typeof OfferTypes[number];

const Goods = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'] as const;
export type GoodType = typeof Goods[number];

class LocationDTO {
  @IsNumber()
  @Min(-90)
  @Max(90)
    latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
    longitude!: number;
}

export class CreateOfferDTO {
  @IsString()
  @Length(10, 100)
    title!: string;

  @IsString()
  @Length(20, 1024)
    description!: string;

  @IsString()
  @IsEnum(Cities)
    city!: CityType;

  @IsString()
  @IsNotEmpty()
    previewImage!: string;

  @IsArray()
  @Length(6, 6, { each: false })
  @IsString({ each: true })
    images!: string[];

  @IsBoolean()
    isPremium!: boolean;

  @IsBoolean()
    isFavorite!: boolean;

  @IsNumber({maxDecimalPlaces: 1})
  @Min(1)
  @Max(5)
    rating!: number;

  @IsString()
  @IsEnum(OfferTypes)
    type!: OfferType;

  @IsInt()
  @Min(1)
  @Max(8)
    bedrooms!: number;

  @IsInt()
  @Min(1)
  @Max(10)
    maxAdults!: number;

  @IsInt()
  @Min(100)
  @Max(100000)
    price!: number;

  @IsArray()
  @IsString({ each: true })
  // хотя ТЗ говорит "один или несколько", проверим хотя бы один
  @ArrayMinSize(1)
    goods!: GoodType[];

  @IsString()
  @IsNotEmpty()
    authorId!: string;

  @ValidateNested()
  @Type(() => LocationDTO)
    location!: LocationDTO;
}


export class UpdateOfferDTO {
  @IsOptional()
  @IsString()
  @Length(10, 100)
    title?: string;

  @IsOptional()
  @IsString()
  @Length(20, 1024)
    description?: string;

  @IsOptional()
  @IsString()
  @IsEnum(Cities)
    city?: CityType;

  @IsOptional()
  @IsString()
    previewImage?: string;

  @IsOptional()
  @IsArray()
  @Length(6, 6, { each: false })
  @IsString({ each: true })
    images?: string[];

  @IsOptional()
  @IsBoolean()
    isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
    isFavorite?: boolean;

  @IsOptional()
  @IsNumber({maxDecimalPlaces: 1})
  @Min(1)
  @Max(5)
    rating?: number;

  @IsOptional()
  @IsString()
  @IsEnum(OfferTypes)
    type?: OfferType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
    bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
    maxAdults?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
    price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
    goods?: GoodType[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDTO)
    location?: LocationDTO;
}
