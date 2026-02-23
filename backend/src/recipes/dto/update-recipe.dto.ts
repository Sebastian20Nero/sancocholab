// src/recipes/dto/update-recipe.dto.ts
import { IsOptional, IsString, MinLength, IsNumberString } from 'class-validator';

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nombre?: string;

  @IsOptional()
  @IsNumberString()
  porcionesBase?: string;

  @IsOptional()
  @IsNumberString()
  categoriaId?: string;
}
