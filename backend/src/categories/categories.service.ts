import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const nombre = dto.nombre.trim();
    const exists = await this.prisma.categoria.findUnique({ where: { nombre } });
    if (exists) throw new BadRequestException('La categoría ya existe.');

    return this.prisma.categoria.create({ data: { nombre } });
  }

  async findAll(params: { activo?: boolean; q?: string }) {
    const where: any = {
      ...(params.activo === undefined ? {} : { activo: params.activo }),
      ...(params.q
        ? { nombre: { contains: params.q, mode: 'insensitive' } }
        : {}),
    };

    return this.prisma.categoria.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: bigint) {
    const item = await this.prisma.categoria.findUnique({ where: { idCategoria: id } });
    if (!item) throw new NotFoundException('Categoría no encontrada.');
    return item;
  }

  async update(id: bigint, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const nombre = dto.nombre.trim();
      const dup = await this.prisma.categoria.findFirst({
        where: { nombre, NOT: { idCategoria: id } },
      });
      if (dup) throw new BadRequestException('La categoría ya existe.');
    }

    return this.prisma.categoria.update({
      where: { idCategoria: id },
      data: {
        ...(dto.nombre !== undefined ? { nombre: dto.nombre.trim() } : {}),
      },
    });
  }

  async setStatus(id: bigint, activo: boolean) {
    await this.findOne(id);
    return this.prisma.categoria.update({
      where: { idCategoria: id },
      data: { activo },
    });
  }
}
