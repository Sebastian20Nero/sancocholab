// src/recipe-categories/recipe-categories.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipeCategoriesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(nombre: string, color?: string) {
    const n = nombre.trim();
    if (!n) throw new BadRequestException('nombre requerido');

    return this.prisma.categoriaReceta.create({
      data: {
        nombre: n,
        activo: true,
        ...(color && { color })
      },
    });
  }

  async findAll(params: { activo?: boolean; q?: string }) {
    const { activo, q } = params;
    return this.prisma.categoriaReceta.findMany({
      where: {
        ...(activo === undefined ? {} : { activo }),
        ...(q ? { nombre: { contains: q, mode: 'insensitive' } } : {}),
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: bigint) {
    const cat = await this.prisma.categoriaReceta.findUnique({ where: { idCategoriaReceta: id } });
    if (!cat) throw new NotFoundException('CategoriaReceta no encontrada');
    return cat;
  }

  async update(id: bigint, nombre?: string, color?: string) {
    const updateData: any = {};

    if (nombre !== undefined) {
      const n = nombre.trim();
      if (!n) throw new BadRequestException('nombre requerido');
      updateData.nombre = n;
    }

    if (color !== undefined) {
      updateData.color = color;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No hay datos para actualizar');
    }

    return this.prisma.categoriaReceta.update({
      where: { idCategoriaReceta: id },
      data: updateData,
    });
  }

  async setStatus(id: bigint, activo: boolean) {
    return this.prisma.categoriaReceta.update({
      where: { idCategoriaReceta: id },
      data: { activo },
    });
  }
}
