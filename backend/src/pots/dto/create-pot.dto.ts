import { IsDateString, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreatePotDto {
  @IsNumberString()
  recetaId!: string;

  @IsDateString()
  fecha!: string; // ISO

  // decimal string (ej "120.000")
  @IsString()
  porciones!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  notas?: string;
}
