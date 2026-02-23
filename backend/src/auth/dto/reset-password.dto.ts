import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Reset de contraseña con token 1-uso.
 */
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}
