import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateQuoteDto {
    @IsString() @IsOptional()
    unidadId?: string; // BigInt como string

    // Numeric como string para evitar problemas de float
    @IsString() @IsOptional()
    @Matches(/^\d+(\.\d{1,2})?$/, { message: 'precioUnitario debe ser numérico (hasta 2 decimales)' })
    precioUnitario?: string;

    @IsString() @IsOptional()
    @Matches(/^\d+(\.\d{1,3})?$/, { message: 'cantidad debe ser numérico (hasta 3 decimales)' })
    cantidad?: string;

    @IsDateString() @IsOptional()
    fecha?: string;

    @IsString() @IsOptional()
    observacion?: string;
}
