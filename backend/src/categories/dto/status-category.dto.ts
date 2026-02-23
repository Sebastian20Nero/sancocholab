import { IsBoolean } from 'class-validator';

export class StatusCategoryDto {
  @IsBoolean()
  activo!: boolean;
}
