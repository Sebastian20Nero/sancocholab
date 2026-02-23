import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions/permissions.guard';
import { RequirePerm } from '../auth/permissions/require-perm.decorator';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

import { RecipeCategoriesService } from './recipe-categories.service';
import { CreateRecipeCategoryDto } from './dto/create-recipe-category.dto';
import { UpdateRecipeCategoryDto } from './dto/update-recipe-category.dto';
import { StatusRecipeCategoryDto } from './dto/status-recipe-category.dto';

@Controller('recipe-categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecipeCategoriesController {
  constructor(private readonly service: RecipeCategoriesService) { }

  @RequirePerm('RECIPE_CATEGORY_CREATE')
  @Post()
  create(@Body() dto: CreateRecipeCategoryDto) {
    return this.service.create(dto.nombre, dto.color);
  }

  @RequirePerm('RECIPE_CATEGORY_READ')
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

  @RequirePerm('RECIPE_CATEGORY_READ')
  @Get(':id')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @RequirePerm('RECIPE_CATEGORY_UPDATE')
  @Patch(':id')
  update(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: UpdateRecipeCategoryDto) {
    return this.service.update(id, dto.nombre, dto.color);
  }

  @RequirePerm('RECIPE_CATEGORY_UPDATE')
  @Patch(':id/status')
  setStatus(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: StatusRecipeCategoryDto) {
    return this.service.setStatus(id, dto.activo);
  }
}
