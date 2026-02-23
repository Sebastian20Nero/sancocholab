import { IsBoolean } from 'class-validator';

export class StatusRecipeCategoryDto {
  @IsBoolean()
  activo!: boolean;
}
