import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class TransferInventoryDto {
  @IsNumberString()
  fromBodegaId!: string;

  @IsNumberString()
  toBodegaId!: string;

  @IsNumberString()
  productoId!: string;

  @IsNumberString()
  unidadId!: string;

  @IsString()
  cantidad!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  referencia?: string;
}
