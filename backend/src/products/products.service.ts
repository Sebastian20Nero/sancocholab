import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCategoriaExists(categoriaId: bigint) {
    const cat = await this.prisma.categoria.findUnique({
      where: { idCategoria: categoriaId },
      select: { idCategoria: true, activo: true },
    });
    if (!cat) throw new BadRequestException('Categoría no existe.');
    // si quieres bloquear categorías inactivas:
    // if (!cat.activo) throw new BadRequestException('La categoría está inactiva.');
  }

  async create(dto: CreateProductDto, userId: bigint) {
    const exists = await this.prisma.producto.findUnique({
      where: { nombre: dto.nombre },
    });
    if (exists) throw new BadRequestException('Nombre de producto ya existe.');

    const categoriaId = dto.categoriaId ? BigInt(dto.categoriaId) : undefined;

    if (categoriaId) {
      await this.assertCategoriaExists(categoriaId);
    }

    return this.prisma.producto.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        categoriaId,
        createdById: userId,
      },
      include: {
        categoria: true, // opcional, para que te retorne la categoría en la respuesta
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    q?: string;
    activo?: boolean;
    categoriaId?: bigint;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(params.activo === undefined ? {} : { activo: params.activo }),
      ...(params.q ? { nombre: { contains: params.q, mode: 'insensitive' } } : {}),
      ...(params.categoriaId ? { categoriaId: params.categoriaId } : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.producto.count({ where }),
      this.prisma.producto.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          categoria: true, // opcional
        },
      }),
    ]);

    return {
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
      items,
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.producto.findUnique({
      where: { idProducto: id },
      include: { categoria: true }, // opcional
    });
    if (!item) throw new NotFoundException('Producto no encontrado.');
    return item;
  }

  async update(id: bigint, dto: UpdateProductDto, userId: bigint) {
    await this.findOne(id);

    if (dto.nombre) {
      const dup = await this.prisma.producto.findFirst({
        where: { nombre: dto.nombre, NOT: { idProducto: id } },
      });
      if (dup) throw new BadRequestException('Nombre de producto ya existe.');
    }

    // Si envían categoriaId, validarlo y convertirlo
    let categoriaId: bigint | undefined = undefined;
    if (dto.categoriaId !== undefined) {
      // permitir "vaciar" categoría: manda "" o null? (si quieres eso lo ajusto)
      if (dto.categoriaId === '' || dto.categoriaId === null) {
        categoriaId = undefined;
      } else {
        categoriaId = BigInt(dto.categoriaId);
        await this.assertCategoriaExists(categoriaId);
      }
    }

    return this.prisma.producto.update({
      where: { idProducto: id },
      data: {
        ...(dto.nombre !== undefined ? { nombre: dto.nombre } : {}),
        ...(dto.descripcion !== undefined ? { descripcion: dto.descripcion } : {}),
        ...(dto.categoriaId !== undefined ? { categoriaId } : {}),
        updatedById: userId,
      },
      include: { categoria: true }, // opcional
    });
  }

  async setStatus(id: bigint, activo: boolean, userId: bigint) {
    await this.findOne(id);

    return this.prisma.producto.update({
      where: { idProducto: id },
      data: {
        activo,
        updatedById: userId,
      },
      include: { categoria: true }, // opcional
    });
  }
}
