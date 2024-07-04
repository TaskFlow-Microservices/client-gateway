import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
