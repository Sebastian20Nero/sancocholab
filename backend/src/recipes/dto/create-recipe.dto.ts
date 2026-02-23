// src/recipes/dto/create-recipe.dto.ts
import { IsOptional, IsString, MinLength, IsNumberString } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  // Decimal viene como string desde HTTP (recomendado)
  @IsOptional()
  @IsNumberString()
  porcionesBase?: string;

  @IsOptional()
  @IsNumberString()
  categoriaId?: string; // BigInt como string
}
