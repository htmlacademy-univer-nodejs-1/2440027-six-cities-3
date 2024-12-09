import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDTO {
  @IsEmail()
    email!: string;

  @IsString()
  @Length(6, 12)
    password!: string;
}
