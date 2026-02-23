import { IsDateString, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePotDto {
  @IsOptional()
  @IsNumberString()
  recetaId?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  porciones?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  notas?: string;
}
