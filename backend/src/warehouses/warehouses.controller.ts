import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions/permissions.guard';
import { RequirePerm } from '../auth/permissions/require-perm.decorator';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { StatusWarehouseDto } from './dto/status-warehouse.dto';

@Controller('warehouses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @RequirePerm('WAREHOUSE_CREATE')
  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.service.create(dto);
  }

  @RequirePerm('WAREHOUSE_READ')
  @Get()
  findAll(@Query('activo') activo?: 'true'|'false', @Query('q') q?: string) {
    return this.service.findAll({
      activo: activo === undefined ? undefined : activo === 'true',
      q,
    });
  }

  @RequirePerm('WAREHOUSE_READ')
  @Get(':id')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @RequirePerm('WAREHOUSE_UPDATE')
  @Patch(':id')
  update(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: UpdateWarehouseDto) {
    return this.service.update(id, dto);
  }

  @RequirePerm('WAREHOUSE_UPDATE')
  @Patch(':id/status')
  setStatus(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: StatusWarehouseDto) {
    return this.service.setStatus(id, dto.activo);
  }
}
