import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions/permissions.guard';
import { RequirePerm } from '../auth/permissions/require-perm.decorator';

import { RecipesService } from './recipes.service';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { StatusRecipeDto } from './dto/status-recipe.dto';
import { CreateRecipeItemDto } from './dto/create-recipe-item.dto';
import { UpdateRecipeItemDto } from './dto/update-recipe-item.dto';
import { ReplaceRecipeItemsDto } from './dto/replace-recipe-items.dto';
import { CalculateRecipeDto } from './dto/calculate-recipe.dto';

@Controller('recipes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecipesController {
  constructor(private readonly service: RecipesService) { }

  @RequirePerm('RECIPE_CREATE')
  @Post()
  create(@Body() dto: CreateRecipeDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @RequirePerm('RECIPE_READ')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('activo') activo?: 'true' | 'false',
    @Query('categoriaId') categoriaId?: string,
  ) {
    return this.service.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      q,
      activo: activo === undefined ? undefined : activo === 'true',
      categoriaId,
    });
  }

  @RequirePerm('RECIPE_READ')
  @Get('quote-check')
  checkQuoteAvailability(
    @Query('productoId') productoId: string,
    @Query('unidadKey') unidadKey: string,
  ) {
    return this.service.checkQuoteAvailability(productoId, unidadKey);
  }

  @RequirePerm('RECIPE_READ')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }


  @RequirePerm('RECIPE_UPDATE')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.userId);
  }

  @RequirePerm('RECIPE_UPDATE')
  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: StatusRecipeDto, @Req() req: any) {
    return this.service.setStatus(id, dto, req.user.userId);
  }

  @RequirePerm('RECIPE_UPDATE')
  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: CreateRecipeItemDto) {
    return this.service.addItem(id, dto);
  }

  @RequirePerm('RECIPE_UPDATE')
  @Put(':id/items')
  replaceItems(@Param('id') id: string, @Body() dto: ReplaceRecipeItemsDto) {
    return this.service.replaceItems(id, dto);
  }

  @RequirePerm('RECIPE_UPDATE')
  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateRecipeItemDto,
  ) {
    return this.service.updateItem(id, itemId, dto);
  }

  @RequirePerm('RECIPE_UPDATE')
  @Delete(':id/items/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.service.removeItem(id, itemId);
  }


  @RequirePerm('RECIPE_CALCULATE')
  @Post(':id/calculate')
  calculate(@Param('id') id: string, @Body() dto: CalculateRecipeDto) {
    return this.service.calculate(id, dto);
  }

  @RequirePerm('RECIPE_READ')
  @Post('batch-estimate')
  batchEstimate(@Body() body: { ids: string[] }) {
    return this.service.batchEstimate(body.ids ?? []);
  }
}
