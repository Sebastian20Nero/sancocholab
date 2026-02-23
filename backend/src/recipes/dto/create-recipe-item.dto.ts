// src/recipes/dto/create-recipe-item.dto.ts
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

// coincide con enum prisma ModoItemReceta
export class CreateRecipeItemDto {
  @IsNumberString()
  productoId: string;

  // unidad que el usuario selecciona (puede ser G/ML/etc)
  @IsNumberString()
  unidadId: string;

  // cantidad digitada (string decimal)
  @IsNumberString()
  cantidad: string;

  @IsOptional()
  @IsNumberString()
  proveedorId?: string; // requerido si modo=BY_PROVIDER (validamos en service)

  @IsOptional()
  @IsIn(['AUTO', 'BY_PROVIDER', 'HYPOTHETICAL'])
  modo?: 'AUTO' | 'BY_PROVIDER' | 'HYPOTHETICAL';
}
