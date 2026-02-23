import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateQuoteDto {
  @IsString() @IsNotEmpty()
  proveedorId: string; // BigInt como string

  @IsString() @IsNotEmpty()
  productoId: string; // BigInt como string

  @IsString() @IsNotEmpty()
  unidadId: string; // BigInt como string

  // Numeric como string para evitar problemas de float
  @IsString() @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'precioUnitario debe ser numérico (hasta 2 decimales)' })
  precioUnitario: string;

  @IsString() @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,3})?$/, { message: 'cantidad debe ser numérico (hasta 3 decimales)' })
  cantidad: string;

  @IsDateString()
  fecha: string;

  @IsString() @IsOptional()
  observacion?: string;
}
