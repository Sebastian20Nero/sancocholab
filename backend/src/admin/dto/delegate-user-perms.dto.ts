import { IsArray, IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PermOverrideDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsBoolean()
  enabled: boolean;
}

/**
 * Delegación de permisos por usuario (overrides).
 */
export class DelegateUserPermsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermOverrideDto)
  overrides: PermOverrideDto[];
}