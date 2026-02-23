import { IsIn, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class AdjustInventoryDto {
  @IsNumberString()
  bodegaId!: string;

  @IsNumberString()
  productoId!: string;

  @IsNumberString()
  unidadId!: string;

  @IsString()
  cantidad!: string; // decimal string

  @IsIn(['IN', 'OUT'])
  direction!: 'IN' | 'OUT';

  @IsOptional()
  @IsString()
  @Length(0, 120)
  referencia?: string;
}
