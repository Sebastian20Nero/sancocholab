import { IsBoolean } from 'class-validator';

export class StatusMeasureDto {
  @IsBoolean()
  activo!: boolean;
}