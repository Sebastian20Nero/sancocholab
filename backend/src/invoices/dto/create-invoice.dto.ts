import { IsDateString, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumberString()
  proveedorId!: string;

  @IsNumberString()
  bodegaId!: string;

  @IsString()
  @Length(1, 50)
  numero!: string;

  @IsDateString()
  fecha!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  observacion?: string;
}
