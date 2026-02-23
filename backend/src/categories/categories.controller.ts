import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StatusCategoryDto } from './dto/status-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Categories')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
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
  update(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  setStatus(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: StatusCategoryDto) {
    return this.service.setStatus(id, dto.activo);
  }
}
