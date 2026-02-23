import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsNumberString()
  productoId!: string;

  @IsNumberString()
  unidadId!: string;

  @IsString()
  cantidad!: string; // Decimal string

  @IsString()
  precioUnitario!: string; // Decimal string

  @IsOptional()
  @IsString()
  observacion?: string;
}
