import { IsDateString, IsIn, IsNumberString, IsOptional } from 'class-validator';

export class QueryInvoicesDto {
  @IsOptional()
  @IsNumberString()
  proveedorId?: string;

  @IsOptional()
  @IsNumberString()
  bodegaId?: string;

  @IsOptional()
  @IsIn(['DRAFT','CONFIRMED','CANCELED'])
  status?: 'DRAFT'|'CONFIRMED'|'CANCELED';

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}
