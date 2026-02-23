import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 120)
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? value : String(value)))
  @IsNumberString()
  categoriaId?: string; // envíalo como "1" o 1 (lo convertimos a string)
}
