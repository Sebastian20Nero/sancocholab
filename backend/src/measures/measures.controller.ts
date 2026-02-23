import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

import { MeasuresService } from './measures.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { UpdateMeasureDto } from './dto/update-measure.dto';
import { StatusMeasureDto } from './dto/status-measure.dto';

@UseGuards(JwtAuthGuard)
@Controller('measures')
export class MeasuresController {
  constructor(private readonly service: MeasuresService) {}

  @Post()
  create(@Body() dto: CreateMeasureDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('activo') activo?: 'true' | 'false',
    @Query('q') q?: string,
  ) {
    return this.service.findAll({
      activo: activo === undefined ? undefined : activo === 'true',
      q,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: UpdateMeasureDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  setStatus(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: StatusMeasureDto) {
    return this.service.setStatus(id, dto.activo);
  }
}
