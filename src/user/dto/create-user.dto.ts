import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../enum/enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
