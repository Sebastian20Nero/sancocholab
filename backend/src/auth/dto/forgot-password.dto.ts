import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Solicitud de "olvidé mi contraseña".
 * En esta etapa NO enviamos correo real (solo generamos token para probar).
 */
export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  correo: string;
}
