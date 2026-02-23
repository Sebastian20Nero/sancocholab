import { IsBoolean } from 'class-validator';

export class StatusProductDto {
  @IsBoolean()
  activo!: boolean;
}
