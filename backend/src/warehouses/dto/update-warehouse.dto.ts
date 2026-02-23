import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  @Length(2, 80)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  descripcion?: string;
}
