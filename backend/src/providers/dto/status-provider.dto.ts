import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class StatusProviderDto {
  @Transform(({ value }) => {
    if (value === true || value === false) return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  activo!: boolean;
}
