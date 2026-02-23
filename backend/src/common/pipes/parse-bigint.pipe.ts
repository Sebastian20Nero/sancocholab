import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    if (!value || !/^\d+$/.test(value)) {
      throw new BadRequestException(
        `Parámetro inválido, se esperaba id numérico. Recibido: ${value}`,
      );
    }
    return BigInt(value);
  }
}