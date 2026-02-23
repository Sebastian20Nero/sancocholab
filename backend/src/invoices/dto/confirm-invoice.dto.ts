import { IsOptional, IsString, Length } from 'class-validator';

export class ConfirmInvoiceDto {
  @IsOptional()
  @IsString()
  @Length(0, 200)
  observacion?: string;
}
