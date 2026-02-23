// src/recipes/dto/status-recipe.dto.ts
import { IsBoolean } from 'class-validator';

export class StatusRecipeDto {
  @IsBoolean()
  activo: boolean;
}
