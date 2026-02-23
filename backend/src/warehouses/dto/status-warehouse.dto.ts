import { IsBoolean } from 'class-validator';

export class StatusWarehouseDto {
  @IsBoolean()
  activo!: boolean;
}
