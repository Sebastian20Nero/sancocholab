import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryPotsDto {
  @IsOptional()
  @IsNumberString()
  recetaId?: string;

  @IsOptional()
  @IsIn(['OPEN', 'CLOSED'])
  status?: 'OPEN' | 'CLOSED';

  @IsOptional()
  @IsString()
  from?: string; // YYYY-MM-DD o ISO

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
