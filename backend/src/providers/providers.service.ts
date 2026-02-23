import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProviderDto, userId: bigint) {
    const exists = await this.prisma.proveedor.findUnique({ where: { nit: dto.nit } });
    if (exists) throw new BadRequestException('NIT ya existe.');

    return this.prisma.proveedor.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    q?: string;
    activo?: boolean;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(params.activo === undefined ? {} : { activo: params.activo }),
      ...(params.q
        ? {
            OR: [
              { nombre: { contains: params.q, mode: 'insensitive' } },
              { nit: { contains: params.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.proveedor.count({ where }),
      this.prisma.proveedor.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
      items,
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.proveedor.findUnique({
      where: { idProveedor: id },
    });
    if (!item) throw new NotFoundException('Proveedor no encontrado.');
    return item;
  }

  async update(id: bigint, dto: UpdateProviderDto, userId: bigint) {
    await this.findOne(id);
    return this.prisma.proveedor.update({
      where: { idProveedor: id },
      data: { ...dto, updatedById: userId },
    });
  }

  async setStatus(id: bigint, activo: boolean, userId: bigint) {
    await this.findOne(id);
    return this.prisma.proveedor.update({
      where: { idProveedor: id },
      data: { activo, updatedById: userId },
    });
  }
}
