import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { UpdateMeasureDto } from './dto/update-measure.dto';

@Injectable()
export class MeasuresService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeKey(key: string) {
    return key.trim().toUpperCase();
  }

  async create(dto: CreateMeasureDto) {
    const key = this.normalizeKey(dto.key);

    const exists = await this.prisma.unidadMedida.findUnique({ where: { key } });
    if (exists) throw new BadRequestException('La unidad de medida (key) ya existe.');

    return this.prisma.unidadMedida.create({
      data: {
        key,
        nombre: dto.nombre.trim(),
      },
    });
  }

  async findAll(params: { activo?: boolean; q?: string }) {
    const where: any = {
      ...(params.activo === undefined ? {} : { activo: params.activo }),
      ...(params.q
        ? {
            OR: [
              { key: { contains: params.q, mode: 'insensitive' } },
              { nombre: { contains: params.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.unidadMedida.findMany({
      where,
      orderBy: { key: 'asc' },
    });
  }

  async findOne(id: bigint) {
    const item = await this.prisma.unidadMedida.findUnique({ where: { idUnidadMedida: id } });
    if (!item) throw new NotFoundException('Unidad de medida no encontrada.');
    return item;
  }

  async update(id: bigint, dto: UpdateMeasureDto) {
    await this.findOne(id);

    let keyNormalized: string | undefined;

    if (dto.key !== undefined) {
      keyNormalized = this.normalizeKey(dto.key);

      const dup = await this.prisma.unidadMedida.findFirst({
        where: { key: keyNormalized, NOT: { idUnidadMedida: id } },
      });
      if (dup) throw new BadRequestException('La unidad de medida (key) ya existe.');
    }

    return this.prisma.unidadMedida.update({
      where: { idUnidadMedida: id },
      data: {
        ...(keyNormalized !== undefined ? { key: keyNormalized } : {}),
        ...(dto.nombre !== undefined ? { nombre: dto.nombre.trim() } : {}),
      },
    });
  }

  async setStatus(id: bigint, activo: boolean) {
    await this.findOne(id);

    return this.prisma.unidadMedida.update({
      where: { idUnidadMedida: id },
      data: { activo },
    });
  }
}
