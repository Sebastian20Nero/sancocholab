import { IsDateString, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsNumberString()
  bodegaId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  numero?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  observacion?: string;
}
