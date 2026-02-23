import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, InventoryMoveType } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private toBigInt(val: string, name: string) {
    if (!val || !/^\d+$/.test(val)) {
      throw new BadRequestException(`${name} inválido: ${val}`);
    }
    return BigInt(val);
  }

  async balances(params: { bodegaId?: string; productoId?: string }) {
    const where: any = {};
    if (params.bodegaId) where.bodegaId = this.toBigInt(params.bodegaId, 'bodegaId');
    if (params.productoId) where.productoId = this.toBigInt(params.productoId, 'productoId');

    return this.prisma.inventarioStock.findMany({
      where,
      include: { bodega: true, producto: true, unidad: true },
      orderBy: [{ bodegaId: 'asc' }, { productoId: 'asc' }],
    });
  }

  async movements(params: {
    bodegaId?: string;
    productoId?: string;
    facturaId?: string;
    from?: string;
    to?: string;
  }) {
    const where: any = {};

    if (params.bodegaId) where.bodegaId = this.toBigInt(params.bodegaId, 'bodegaId');
    if (params.productoId) where.productoId = this.toBigInt(params.productoId, 'productoId');
    if (params.facturaId) where.facturaId = this.toBigInt(params.facturaId, 'facturaId');

    // filtro por fechas: [from, to] inclusive en días (to se vuelve exclusivo +1 día)
    if (params.from || params.to) {
      const from = params.from ? new Date(params.from) : undefined;

      let toEx: Date | undefined;
      if (params.to) {
        const d = new Date(params.to);
        d.setDate(d.getDate() + 1);
        toEx = d;
      }

      where.fecha = {
        ...(from ? { gte: from } : {}),
        ...(toEx ? { lt: toEx } : {}),
      };
    }

    return this.prisma.inventarioMovimiento.findMany({
      where,
      include: { bodega: true, producto: true, unidad: true, factura: true },
      orderBy: { fecha: 'desc' },
      take: 500,
    });
  }

  /**
   * Ajuste manual de inventario:
   * - direction: IN suma, OUT resta
   * - genera movimiento type=ADJUST (kardex)
   */
  async adjust(dto: any, userId: string) {
    const bodegaId = this.toBigInt(dto.bodegaId, 'bodegaId');
    const productoId = this.toBigInt(dto.productoId, 'productoId');
    const unidadId = this.toBigInt(dto.unidadId, 'unidadId');
    const createdById = this.toBigInt(userId, 'userId');

    if (!['IN', 'OUT'].includes(dto.direction)) {
      throw new BadRequestException('direction debe ser IN o OUT');
    }

    const cantidad = new Prisma.Decimal(dto.cantidad);
    if (cantidad.lte('0')) throw new BadRequestException('cantidad debe ser > 0');

    const inc = dto.direction === 'IN';
    const referencia = dto.referencia?.trim() || 'ADJUSTMENT';

    return this.prisma.$transaction(async (tx) => {
      // Validar existencias (recomendado para mensajes claros)
      const [bod, prod, uni] = await Promise.all([
        tx.bodega.findUnique({ where: { idBodega: bodegaId } }),
        tx.producto.findUnique({ where: { idProducto: productoId } }),
        tx.unidadMedida.findUnique({ where: { idUnidadMedida: unidadId } }),
      ]);
      if (!bod || !bod.activo) throw new BadRequestException('Bodega no existe o está inactiva.');
      if (!prod || !prod.activo) throw new BadRequestException('Producto no existe o está inactivo.');
      if (!uni || !uni.activo) throw new BadRequestException('Unidad no existe o está inactiva.');

      if (!inc) {
        const stock = await tx.inventarioStock.findUnique({
          where: {
            bodegaId_productoId_unidadId: { bodegaId, productoId, unidadId },
          },
        });
        if (!stock || stock.cantidad.lt(cantidad)) {
          throw new BadRequestException('Stock insuficiente para ajuste OUT.');
        }
      }

      await tx.inventarioStock.upsert({
        where: { bodegaId_productoId_unidadId: { bodegaId, productoId, unidadId } },
        create: {
          bodegaId,
          productoId,
          unidadId,
          cantidad: inc ? cantidad : new Prisma.Decimal('0'),
        },
        update: {
          cantidad: inc ? { increment: cantidad } : { decrement: cantidad },
        },
      });

      await tx.inventarioMovimiento.create({
        data: {
          type: InventoryMoveType.ADJUST,
          bodegaId,
          productoId,
          unidadId,
          cantidad,
          referencia: `${referencia}:${dto.direction}`,
          createdById,
        },
      });

      return tx.inventarioStock.findUnique({
        where: { bodegaId_productoId_unidadId: { bodegaId, productoId, unidadId } },
        include: { bodega: true, producto: true, unidad: true },
      });
    });
  }

  /**
   * Transferencia entre bodegas:
   * - OUT en origen, IN en destino
   * - genera 2 movimientos (kardex)
   */
  async transfer(dto: any, userId: string) {
    const fromBodegaId = this.toBigInt(dto.fromBodegaId, 'fromBodegaId');
    const toBodegaId = this.toBigInt(dto.toBodegaId, 'toBodegaId');
    const productoId = this.toBigInt(dto.productoId, 'productoId');
    const unidadId = this.toBigInt(dto.unidadId, 'unidadId');
    const createdById = this.toBigInt(userId, 'userId');

    const cantidad = new Prisma.Decimal(dto.cantidad);
    if (cantidad.lte('0')) throw new BadRequestException('cantidad debe ser > 0');
    if (fromBodegaId === toBodegaId) {
      throw new BadRequestException('fromBodegaId y toBodegaId no pueden ser iguales');
    }

    const ref = dto.referencia?.trim() || 'TRANSFER';

    return this.prisma.$transaction(async (tx) => {
      const [fromBod, toBod, prod, uni] = await Promise.all([
        tx.bodega.findUnique({ where: { idBodega: fromBodegaId } }),
        tx.bodega.findUnique({ where: { idBodega: toBodegaId } }),
        tx.producto.findUnique({ where: { idProducto: productoId } }),
        tx.unidadMedida.findUnique({ where: { idUnidadMedida: unidadId } }),
      ]);
      if (!fromBod || !fromBod.activo) throw new BadRequestException('Bodega origen no existe o está inactiva.');
      if (!toBod || !toBod.activo) throw new BadRequestException('Bodega destino no existe o está inactiva.');
      if (!prod || !prod.activo) throw new BadRequestException('Producto no existe o está inactivo.');
      if (!uni || !uni.activo) throw new BadRequestException('Unidad no existe o está inactiva.');

      const fromStock = await tx.inventarioStock.findUnique({
        where: {
          bodegaId_productoId_unidadId: { bodegaId: fromBodegaId, productoId, unidadId },
        },
      });
      if (!fromStock || fromStock.cantidad.lt(cantidad)) {
        throw new BadRequestException('Stock insuficiente en bodega origen');
      }

      // OUT origen
      await tx.inventarioStock.update({
        where: { idInventarioStock: fromStock.idInventarioStock },
        data: { cantidad: { decrement: cantidad } },
      });

      await tx.inventarioMovimiento.create({
        data: {
          type: InventoryMoveType.OUT,
          bodegaId: fromBodegaId,
          productoId,
          unidadId,
          cantidad,
          referencia: `${ref}:OUT`,
          createdById,
        },
      });

      // IN destino
      await tx.inventarioStock.upsert({
        where: { bodegaId_productoId_unidadId: { bodegaId: toBodegaId, productoId, unidadId } },
        create: { bodegaId: toBodegaId, productoId, unidadId, cantidad },
        update: { cantidad: { increment: cantidad } },
      });

      await tx.inventarioMovimiento.create({
        data: {
          type: InventoryMoveType.IN,
          bodegaId: toBodegaId,
          productoId,
          unidadId,
          cantidad,
          referencia: `${ref}:IN`,
          createdById,
        },
      });

      return { ok: true };
    });
  }
}
