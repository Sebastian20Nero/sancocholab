import {
  IsArray,
  IsDateString,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OverridePriceDto {
  @IsNumberString()
  productoId!: string;

  // Decimal string "5000.00"
  @IsNumberString()
  precioUnitario!: string;
}

export class CalculateRecipeDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsNumberString()
  porciones?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OverridePriceDto)
  overrides?: OverridePriceDto[];
}
