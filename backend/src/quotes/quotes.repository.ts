// src/quotes/quotes.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuotesRepository {
  constructor(private readonly prisma: PrismaService) { }

  // ✅ Selects consistentes (evita traer "todo" y facilita el front)
  private readonly includeFull = {
    proveedor: { select: { idProveedor: true, nombre: true, activo: true } },
    producto: {
      select: {
        idProducto: true,
        nombre: true,
        activo: true,
        categoriaId: true,
        categoria: { select: { idCategoria: true, nombre: true } }
      }
    },
    unidad: { select: { idUnidadMedida: true, key: true, nombre: true, activo: true } },
    createdBy: {
      select: {
        idUsuario: true,
        persona: { select: { idPersona: true, nombres: true, apellidos: true, correo: true } },
      },
    },
  } as const;

  private readonly includeLite = {
    proveedor: { select: { idProveedor: true, nombre: true } },
    producto: {
      select: {
        idProducto: true,
        nombre: true,
        categoria: { select: { idCategoria: true, nombre: true } }
      }
    },
    unidad: { select: { idUnidadMedida: true, key: true, nombre: true } },
  } as const;

  create(data: Prisma.CotizacionCreateInput) {
    return this.prisma.cotizacion.create({
      data,
      include: this.includeFull,
    });
  }

  findMany(where: Prisma.CotizacionWhereInput) {
    return this.prisma.cotizacion.findMany({
      where,
      include: this.includeFull,
      orderBy: [{ fecha: 'desc' }, { createdAt: 'desc' }],
      take: 200,
    });
  }

  findById(idCotizacion: bigint) {
    return this.prisma.cotizacion.findUnique({
      where: { idCotizacion },
      include: this.includeFull,
    });
  }

  update(idCotizacion: bigint, data: Prisma.CotizacionUpdateInput) {
    return this.prisma.cotizacion.update({
      where: { idCotizacion },
      data,
      include: this.includeFull,
    });
  }

  /**
   * Más recientes por proveedor o por producto.
   */
  latestByFilter(params: { proveedorId?: bigint; productoId?: bigint; take?: number }) {
    const { proveedorId, productoId, take = 20 } = params;

    return this.prisma.cotizacion.findMany({
      where: {
        activo: true,
        ...(proveedorId ? { proveedorId } : {}),
        ...(productoId ? { productoId } : {}),
      },
      include: this.includeLite,
      orderBy: [{ fecha: 'desc' }, { createdAt: 'desc' }],
      take,
    });
  }

  /**
   * Mejor precio reciente por producto.
   * Regla: toma cotizaciones activas, ordena por precio asc y fecha desc.
   */
  bestPriceForProduct(productoId: bigint) {
    return this.prisma.cotizacion.findFirst({
      where: { activo: true, productoId },
      include: this.includeLite,
      orderBy: [{ precioUnitario: 'asc' }, { fecha: 'desc' }],
    });
  }
}
