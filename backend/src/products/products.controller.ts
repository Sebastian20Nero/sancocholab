import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StatusProductDto } from './dto/status-product.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  private getUserId(req: any): bigint {
    const raw = req?.user?.userId; // <- tu estrategia devuelve userId
    if (!raw) throw new UnauthorizedException('Token inválido: no se encontró userId en req.user.');
    return BigInt(raw);
  }

  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.service.create(dto, this.getUserId(req));
  }

  @Get()
findAll(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('q') q?: string,
  @Query('activo') activo?: 'true' | 'false',
  @Query('categoriaId') categoriaId?: string, // ✅
  @Query('categoryId') categoryId?: string,   // ✅ compat
) {
  const id = categoriaId ?? categoryId;

  return this.service.findAll({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    q,
    activo: activo === undefined ? undefined : activo === 'true',
    categoriaId: id ? BigInt(id) : undefined,
  });
}


  @Get(':id')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, this.getUserId(req));
  }

  @Patch(':id/status')
  setStatus(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: StatusProductDto,
    @Req() req: any,
  ) {
    return this.service.setStatus(id, dto.activo, this.getUserId(req));
  }
}
