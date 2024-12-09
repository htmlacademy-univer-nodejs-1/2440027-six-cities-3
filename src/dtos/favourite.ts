import { IsString } from 'class-validator';

export class AddFavoriteDTO {
  @IsString()
    offerId!: string;
}
