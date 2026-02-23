import { IsBoolean } from 'class-validator';

/**
 * DTO para activar/inactivar un usuario.
 * - No borra registros, solo cambia el flag "activo".
 */
export class UpdateUserStatusDto {
  @IsBoolean()
  activo: boolean;
}