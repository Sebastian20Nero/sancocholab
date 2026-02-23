import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UnitConversionService } from './unit-conversion.service';

@Module({
  imports: [PrismaModule],
  providers: [UnitConversionService],
  exports: [UnitConversionService],
})
export class UnitConversionModule {}