import { IsString, Length, IsInt, Min, Max } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @Length(5, 1024)
    text!: string;

  @IsInt()
  @Min(1)
  @Max(5)
    rating!: number;
}
