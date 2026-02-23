import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty()
  nombres: string;

  @IsString() @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  correo: string;

  @IsString() @IsNotEmpty()
  celular: string;


  @IsString() @MinLength(8)
  password: string;
}
