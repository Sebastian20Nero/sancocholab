import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { StatusProviderDto } from './dto/status-provider.dto';

// Si ya tienes un ParseBigIntPipe, úsalo. Si no, te dejo uno al final.
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';
import { UnauthorizedException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly service: ProvidersService) {}

  private getUserId(req: any): bigint {
    const raw = req?.user?.userId; // <- ESTE es el que tienes
    if (!raw) throw new UnauthorizedException('Token inválido: no se encontró userId en req.user.');
    return BigInt(raw);
  }

  @Post()
    create(@Body() dto: CreateProviderDto, @Req() req: any) {
    console.log('AUTH HEADER =>', req.headers?.authorization);
    console.log('REQ.USER =>', req.user);
    return this.service.create(dto, this.getUserId(req));
 }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('activo') activo?: 'true' | 'false',
  ) {
    return this.service.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      q,
      activo: activo === undefined ? undefined : activo === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateProviderDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, this.getUserId(req));
  }

  @Patch(':id/status')
  setStatus(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: StatusProviderDto,
    @Req() req: any,
  ) {
    return this.service.setStatus(id, dto.activo, this.getUserId(req));
  }
}
