import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

/**
 * Reemplaza roles del usuario por los enviados.
 */
export class SetUserRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles: string[];
}
