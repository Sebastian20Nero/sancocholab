import { IsString, Length, IsOptional, Matches } from 'class-validator';

export class CreateRecipeCategoryDto {
  @IsString()
  @Length(2, 80)
  nombre!: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be a valid hex color (e.g., #3B82F6)' })
  color?: string;
}
