import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWarehouseDto) {
    const nombre = dto.nombre.trim();
    const dup = await this.prisma.bodega.findUnique({ where: { nombre } });
    if (dup) throw new BadRequestException('La bodega ya existe.');

    return this.prisma.bodega.create({
      data: { nombre, descripcion: dto.descripcion?.trim() || null },
    });
  }

  async findAll(params: { activo?: boolean; q?: string }) {
    const where: any = {
      ...(params.activo === undefined ? {} : { activo: params.activo }),
      ...(params.q ? { nombre: { contains: params.q, mode: 'insensitive' } } : {}),
    };
    return this.prisma.bodega.findMany({ where, orderBy: { nombre: 'asc' } });
  }

  async findOne(id: bigint) {
    const item = await this.prisma.bodega.findUnique({ where: { idBodega: id } });
    if (!item) throw new NotFoundException('Bodega no encontrada.');
    return item;
  }

  async update(id: bigint, dto: UpdateWarehouseDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const nombre = dto.nombre.trim();
      const dup = await this.prisma.bodega.findFirst({
        where: { nombre, NOT: { idBodega: id } },
      });
      if (dup) throw new BadRequestException('La bodega ya existe.');
    }

    return this.prisma.bodega.update({
      where: { idBodega: id },
      data: {
        ...(dto.nombre !== undefined ? { nombre: dto.nombre.trim() } : {}),
        ...(dto.descripcion !== undefined ? { descripcion: dto.descripcion?.trim() || null } : {}),
      },
    });
  }

  async setStatus(id: bigint, activo: boolean) {
    await this.findOne(id);
    return this.prisma.bodega.update({
      where: { idBodega: id },
      data: { activo },
    });
  }
}
