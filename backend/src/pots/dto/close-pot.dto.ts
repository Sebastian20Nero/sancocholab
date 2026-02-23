import { IsOptional, IsString, Length } from 'class-validator';

export class ClosePotDto {
  @IsOptional()
  @IsString()
  @Length(0, 200)
  motivo?: string; // opcional, por si quieres guardarlo en snapshot/notas
}
