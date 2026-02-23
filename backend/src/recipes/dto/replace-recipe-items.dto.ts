// src/recipes/dto/replace-recipe-items.dto.ts
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRecipeItemDto } from './create-recipe-item.dto';

export class ReplaceRecipeItemsDto {
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeItemDto)
  items: CreateRecipeItemDto[];
}
