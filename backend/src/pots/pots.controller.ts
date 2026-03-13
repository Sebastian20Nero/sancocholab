import { Body, Controller, Get, Param, Patch, Post, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions/permissions.guard';
import { RequirePerm } from '../auth/permissions/require-perm.decorator';
import { PotsService } from './pots.service';
import { CreatePotDto } from './dto/create-pot.dto';
import { UpdatePotDto } from './dto/update-pot.dto';
import { ClosePotDto } from './dto/close-pot.dto';
import { QueryPotsDto } from './dto/query-pots.dto';

@Controller('pots')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PotsController {
  constructor(private readonly service: PotsService) { }

  @RequirePerm('POT_CREATE')
  @Post()
  create(@Body() dto: CreatePotDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @RequirePerm('POT_READ')
  @Get()
  list(@Query() q: QueryPotsDto) {
    return this.service.findAll(q);
  }

  // ─── OllaPedido (multi-receta) ───

  @RequirePerm('POT_CREATE')
  @Post('pedidos')
  createPedido(
    @Body() dto: { nombre: string; fecha: string; notas?: string; items: { recetaId: string; porciones: string }[] },
    @Req() req: any,
  ) {
    return this.service.createPedido(dto, req.user.userId);
  }

  // @RequirePerm('POT_READ')
  @Get('pedidos')
  listPedidos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.listPedidos({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      from,
      to,
    });
  }

  // @RequirePerm('POT_READ')
  @Get('pedidos/:id')
  getPedido(@Param('id') id: string) {
    return this.service.findOnePedido(id);
  }

  @RequirePerm('POT_DELETE')
  @Delete('pedidos/:id')
  deletePedido(@Param('id') id: string) {
    return this.service.deletePedido(id);
  }

  @RequirePerm('POT_UPDATE')
  @Patch('pedidos/:id')
  updatePedido(@Param('id') id: string, @Body() dto: { nombre: string }) {
    return this.service.updatePedidoNombre(id, dto.nombre);
  }

  @RequirePerm('POT_READ')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @RequirePerm('POT_UPDATE')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePotDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.userId);
  }

  @RequirePerm('POT_CLOSE')
  @Post(':id/close')
  close(@Param('id') id: string, @Body() dto: ClosePotDto, @Req() req: any) {
    return this.service.close(id, req.user.userId, dto.motivo);
  }
}
