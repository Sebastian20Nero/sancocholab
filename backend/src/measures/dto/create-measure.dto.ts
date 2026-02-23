import { IsString, Length } from 'class-validator';

export class CreateMeasureDto {
  @IsString()
  @Length(1, 20)
  key!: string; // KG, G, L, ML, UND

  @IsString()
  @Length(2, 60)
  nombre!: string; // Kilogramo, Gramo...
}
