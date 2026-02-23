import { IsDateString, IsNumberString, IsOptional } from 'class-validator';

export class QueryQuotesDto {
  @IsOptional()
  @IsNumberString()
  proveedorId?: string;

  @IsOptional()
  @IsNumberString()
  productoId?: string;

  @IsOptional()
  @IsNumberString()
  categoriaId?: string;

  // NUEVO: from/to
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  // Si quieres mantener compatibilidad con dateFrom/dateTo:
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
