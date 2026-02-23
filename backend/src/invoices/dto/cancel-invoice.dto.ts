import { IsString, Length } from 'class-validator';

export class CancelInvoiceDto {
  @IsString()
  @Length(3, 200)
  reason!: string;
}
