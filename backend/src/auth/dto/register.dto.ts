import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO del registro público.
 * Importante: NO existe username, el identificador único es "correo".
 */
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  celular: string;

  @IsString()
  @MinLength(8)
  password: string;
}
