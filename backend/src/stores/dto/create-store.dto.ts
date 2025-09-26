import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;
}