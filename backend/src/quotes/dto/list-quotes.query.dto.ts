import { IsDateString, IsNumberString, IsOptional } from 'class-validator';

export class ListQuotesQueryDto {
  @IsOptional()
  @IsNumberString()
  proveedorId?: string;

  @IsOptional()
  @IsNumberString()
  productoId?: string;

  // acepta "2026-01-01" o ISO completo
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
