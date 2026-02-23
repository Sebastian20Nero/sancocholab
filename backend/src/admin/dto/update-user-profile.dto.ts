import { IsOptional, IsString } from 'class-validator';

/**
 * DTO para editar los datos de la PERSONA asociada al usuario.
 * - No incluye correo (correo es único y lo usamos como login).
 * - Si quieres permitir cambio de correo, se hace en otro endpoint especial.
 */
export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  celular?: string;
}
