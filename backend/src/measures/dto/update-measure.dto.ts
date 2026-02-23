import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateMeasureDto {
  @IsOptional()
  @IsString()
  @Length(1, 20)
  key?: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  nombre?: string;
}
