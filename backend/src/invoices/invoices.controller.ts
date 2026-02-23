import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions/permissions.guard';
import { RequirePerm } from '../auth/permissions/require-perm.decorator';

import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';
import { ReplaceInvoiceItemsDto } from './dto/replace-invoice-items.dto';
import { ConfirmInvoiceDto } from './dto/confirm-invoice.dto';
import { CancelInvoiceDto } from './dto/cancel-invoice.dto';
import { QueryInvoicesDto } from './dto/query-invoices.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Delete } from '@nestjs/common';

@Controller('invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @RequirePerm('INVOICE_CREATE')
  @Post()
  create(@Body() dto: CreateInvoiceDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @RequirePerm('INVOICE_CREATE')
  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: CreateInvoiceItemDto) {
    return this.service.addItem(id, dto);
  }

  @RequirePerm('INVOICE_CREATE')
  @Put(':id/items')
  replaceItems(@Param('id') id: string, @Body() dto: ReplaceInvoiceItemsDto) {
    return this.service.replaceItems(id, dto);
  }

  @RequirePerm('INVOICE_CREATE')
  @Patch(':id/items/:itemId/delete') // opcional si prefieres PATCH
  removeItemPatch(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.service.removeItem(id, itemId);
  }

  @RequirePerm('INVOICE_READ')
  @Get()
  list(@Query() q: QueryInvoicesDto) {
    return this.service.list(q);
  }

  @RequirePerm('INVOICE_READ')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @RequirePerm('INVOICE_CREATE') // reutilizamos este permiso para editar DRAFT
    @Patch(':id')
    updateHeader(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
      return this.service.updateHeader(id, dto);
  }

  @RequirePerm('INVOICE_CONFIRM')
  @Post(':id/confirm')
  confirm(@Param('id') id: string, @Body() dto: ConfirmInvoiceDto, @Req() req: any) {
    return this.service.confirm(id, req.user.userId, dto.observacion);
  }

  @RequirePerm('INVOICE_CANCEL')
  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body() dto: CancelInvoiceDto, @Req() req: any) {
    return this.service.cancel(id, req.user.userId, dto.reason);
  }

  @RequirePerm('INVOICE_CREATE')
  @Delete(':id/items/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.service.removeItem(id, itemId);
  }
}
