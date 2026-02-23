import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { QuotesRepository } from './quotes.repository';
import { ExcelService } from './excel.service';
import { BulkUploadService } from './bulk-upload.service';
import { UnitConversionModule } from '../unit-conversion/unit-conversion.module';

@Module({
  imports: [UnitConversionModule],
  controllers: [QuotesController],
  providers: [QuotesService, QuotesRepository, ExcelService, BulkUploadService],
})
export class QuotesModule { }
