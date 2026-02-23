import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions/permissions.guard';
import { RequirePerm } from '../auth/permissions/require-perm.decorator';
import { InventoryService } from './inventory.service';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { TransferInventoryDto } from './dto/transfer-inventory.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  /**
   * GET /inventory?bodegaId=&productoId=
   * Devuelve saldos por bodega/producto/unidad.
   */
  @RequirePerm('INVENTORY_READ')
  @Get()
  balances(
    @Query('bodegaId') bodegaId?: string,
    @Query('productoId') productoId?: string,
  ) {
    return this.service.balances({ bodegaId, productoId });
  }

  /**
   * GET /inventory/movements?bodegaId=&productoId=&facturaId=&from=YYYY-MM-DD&to=YYYY-MM-DD
   * Kardex (movimientos) con filtros opcionales.
   */
  @RequirePerm('INVENTORY_READ')
  @Get('movements')
  movements(
    @Query('bodegaId') bodegaId?: string,
    @Query('productoId') productoId?: string,
    @Query('facturaId') facturaId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.movements({ bodegaId, productoId, facturaId, from, to });
  }

  /**
   * POST /inventory/adjustments
   * Ajuste manual: direction IN/OUT.
   */
  @RequirePerm('INVENTORY_ADJUST')
  @Post('adjustments')
  adjust(@Body() dto: AdjustInventoryDto, @Req() req: any) {
    return this.service.adjust(dto, req.user.userId);
  }

  /**
   * POST /inventory/transfers
   * Transferencia entre bodegas: OUT origen, IN destino.
   */
  @RequirePerm('INVENTORY_TRANSFER')
  @Post('transfers')
  transfer(@Body() dto: TransferInventoryDto, @Req() req: any) {
    return this.service.transfer(dto, req.user.userId);
  }
}
