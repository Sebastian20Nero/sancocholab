import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Req,
  UseGuards,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions/permissions.guard';
import { RequirePerm } from '../auth/permissions/require-perm.decorator';
import { QuotesService } from './quotes.service';
import { ExcelService } from './excel.service';
import { BulkUploadService } from './bulk-upload.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QueryQuotesDto } from './dto/query-quotes.dto';

@Controller('quotes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class QuotesController {
  constructor(
    private quotes: QuotesService,
    private excel: ExcelService,
    private bulkUpload: BulkUploadService,
  ) { }

  /**
   * POST /quotes
   * Registra una cotización (precioUnitario, cantidad, unidad, fecha) asociada a proveedor+producto.
   */
  @RequirePerm('QUOTE_CREATE')
  @Post()
  create(@Body() dto: CreateQuoteDto, @Req() req: any) {
    return this.quotes.create(dto, req.user.userId);
  }

  /**
   * GET /quotes
   * Lista cotizaciones con filtros opcionales.
   */
  @RequirePerm('QUOTE_READ')
  @Get()
  list(@Query() q: QueryQuotesDto) {
    return this.quotes.list(q);
  }

  /**
   * GET /quotes/template
   * Descarga plantilla de Excel para carga masiva de cotizaciones
   * No requiere permisos especiales ya que es solo una plantilla vacía
   */
  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    try {
      const buffer = await this.excel.generateQuotationsTemplate();

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=cotizaciones_template.xlsx',
      );

      res.send(buffer);
    } catch (error) {
      console.error('Error generating Excel template:', error);
      throw new BadRequestException(`Error al generar plantilla: ${error.message}`);
    }
  }

  /**
   * POST /quotes/bulk-upload
   * Carga masiva de cotizaciones desde archivo Excel
   */
  @RequirePerm('QUOTE_CREATE')
  @Post('bulk-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.mimetype === 'application/vnd.ms-excel'
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
        }
      },
    }),
  )
  async bulkUploadQuotes(
    @UploadedFile() file: any, // Using any for Multer file compatibility
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Parse Excel file
    const rows = await this.excel.parseQuotationsFile(file.buffer);

    // Process bulk upload
    const userId = BigInt(req.user.userId);
    const result = await this.bulkUpload.processBulkUpload(rows, userId);

    return result;
  }

  /**
   * GET /quotes/latest?proveedorId=1&take=20
   * GET /quotes/latest?productoId=2&take=20
   */
  @RequirePerm('QUOTE_READ')
  @Get('latest')
  latest(@Query() q: any) {
    return this.quotes.latest(q);
  }

  /**
   * GET /quotes/best-price?productoId=2
   * Devuelve cotización activa más barata (y reciente en caso de empate).
   */
  @RequirePerm('QUOTE_READ')
  @Get('best-price')
  bestPrice(@Query('productoId') productoId: string) {
    return this.quotes.bestPrice(productoId);
  }

  /**
   * GET /quotes/:id
   */
  @RequirePerm('QUOTE_READ')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.quotes.getById(id);
  }

  /**
   * PUT /quotes/:id
   * Actualiza una cotización existente (cantidad, unidad, precio, fecha, observación)
   */
  @RequirePerm('QUOTE_UPDATE')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuoteDto, @Req() req: any) {
    return this.quotes.update(id, dto, req.user.userId);
  }

  /**
   * DELETE /quotes/:id
   * Inactiva una cotización (soft delete)
   */
  @RequirePerm('QUOTE_DELETE')
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.quotes.deactivate(id, req.user.userId);
  }
}

