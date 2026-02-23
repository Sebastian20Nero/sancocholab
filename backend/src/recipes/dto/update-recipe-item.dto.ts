// src/recipes/dto/update-recipe-item.dto.ts
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class UpdateRecipeItemDto {
  @IsOptional()
  @IsNumberString()
  productoId?: string;

  @IsOptional()
  @IsNumberString()
  unidadId?: string;

  @IsOptional()
  @IsNumberString()
  cantidad?: string;

  @IsOptional()
  @IsNumberString()
  proveedorId?: string;

  @IsOptional()
  @IsIn(['AUTO', 'BY_PROVIDER', 'HYPOTHETICAL'])
  modo?: 'AUTO' | 'BY_PROVIDER' | 'HYPOTHETICAL';
}
