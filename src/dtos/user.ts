import { IsString, Length, IsEmail, IsOptional, Matches, IsEnum } from 'class-validator';

export enum UserType {
  Regular = 'regular',
  Pro = 'pro'
}

export class CreateUserDTO {
  @IsString()
  @Length(1, 15)
    name!: string;

  @IsEmail()
    email!: string;

  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|png)$/i, { message: 'Avatar must be a .jpg or .png image' })
    avatarUrl?: string;

  @IsString()
  @Length(6, 12)
    password!: string;

  @IsString()
  @IsEnum(UserType, { message: 'UserType must be either "regular" or "pro"' })
    userType!: UserType;
}
