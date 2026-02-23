import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, InvoiceStatus, InventoryMoveType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto';
import { ReplaceInvoiceItemsDto } from './dto/replace-invoice-items.dto';
import { QueryInvoicesDto } from './dto/query-invoices.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  private toBigInt(val: string, name: string) {
    if (!val || !/^\d+$/.test(val)) throw new BadRequestException(`${name} inválido: ${val}`);
    return BigInt(val);
  }

  private async getInvoiceOrFail(id: bigint) {
    const inv = await this.prisma.factura.findUnique({
      where: { idFactura: id },
      include: {
        proveedor: true,
        bodega: true,
        items: { include: { producto: true, unidad: true }, orderBy: { idFacturaItem: 'asc' } },
      },
    });
    if (!inv) throw new NotFoundException('Factura no encontrada.');
    return inv;
  }

  async create(dto: CreateInvoiceDto, userId: string) {
    const createdById = this.toBigInt(userId, 'userId');
    const proveedorId = this.toBigInt(dto.proveedorId, 'proveedorId');
    const bodegaId = this.toBigInt(dto.bodegaId, 'bodegaId');

    const [prov, bod] = await Promise.all([
      this.prisma.proveedor.findUnique({ where: { idProveedor: proveedorId } }),
      this.prisma.bodega.findUnique({ where: { idBodega: bodegaId } }),
    ]);
    if (!prov || !prov.activo) throw new BadRequestException('Proveedor no existe o está inactivo.');
    if (!bod || !bod.activo) throw new BadRequestException('Bodega no existe o está inactiva.');

    return this.prisma.factura.create({
      data: {
        proveedorId,
        bodegaId,
        numero: dto.numero.trim(),
        fecha: new Date(dto.fecha),
        observacion: dto.observacion?.trim() || null,
        status: 'DRAFT',
        activo: true,
        createdById,
      },
    });
  }

  async addItem(invoiceId: string, dto: CreateInvoiceItemDto) {
    const idFactura = this.toBigInt(invoiceId, 'invoiceId');
    const inv = await this.getInvoiceOrFail(idFactura);
    if (inv.status !== 'DRAFT') throw new BadRequestException('Solo puedes editar items en estado DRAFT.');

    const productoId = this.toBigInt(dto.productoId, 'productoId');
    const unidadId = this.toBigInt(dto.unidadId, 'unidadId');

    const [prod, uni] = await Promise.all([
      this.prisma.producto.findUnique({ where: { idProducto: productoId } }),
      this.prisma.unidadMedida.findUnique({ where: { idUnidadMedida: unidadId } }),
    ]);
    if (!prod || !prod.activo) throw new BadRequestException('Producto no existe o está inactivo.');
    if (!uni || !uni.activo) throw new BadRequestException('Unidad no existe o está inactiva.');

    const cantidad = new Prisma.Decimal(dto.cantidad);
    const precioUnitario = new Prisma.Decimal(dto.precioUnitario);
    if (cantidad.lte('0')) throw new BadRequestException('cantidad debe ser > 0');
    if (precioUnitario.lte('0')) throw new BadRequestException('precioUnitario debe ser > 0');

    return this.prisma.facturaItem.create({
      data: {
        facturaId: idFactura,
        productoId,
        unidadId,
        cantidad,
        precioUnitario,
        observacion: dto.observacion?.trim() || null,
      },
      include: { producto: true, unidad: true },
    });
  }

  async replaceItems(invoiceId: string, dto: ReplaceInvoiceItemsDto) {
    const idFactura = this.toBigInt(invoiceId, 'invoiceId');
    const inv = await this.getInvoiceOrFail(idFactura);
    if (inv.status !== 'DRAFT') throw new BadRequestException('Solo puedes editar items en estado DRAFT.');

    if (!dto.items || !Array.isArray(dto.items)) throw new BadRequestException('items debe ser un arreglo.');

    const normalized = await Promise.all(dto.items.map(async (it, idx) => {
      const productoId = this.toBigInt(it.productoId, `items[${idx}].productoId`);
      const unidadId = this.toBigInt(it.unidadId, `items[${idx}].unidadId`);

      const [prod, uni] = await Promise.all([
        this.prisma.producto.findUnique({ where: { idProducto: productoId } }),
        this.prisma.unidadMedida.findUnique({ where: { idUnidadMedida: unidadId } }),
      ]);
      if (!prod || !prod.activo) throw new BadRequestException(`items[${idx}] producto no existe/activo.`);
      if (!uni || !uni.activo) throw new BadRequestException(`items[${idx}] unidad no existe/activa.`);

      const cantidad = new Prisma.Decimal(it.cantidad);
      const precioUnitario = new Prisma.Decimal(it.precioUnitario);
      if (cantidad.lte('0')) throw new BadRequestException(`items[${idx}].cantidad debe ser > 0`);
      if (precioUnitario.lte('0')) throw new BadRequestException(`items[${idx}].precioUnitario debe ser > 0`);

      return {
        facturaId: idFactura,
        productoId,
        unidadId,
        cantidad,
        precioUnitario,
        observacion: it.observacion?.trim() || null,
      };
    }));

    await this.prisma.$transaction(async (tx) => {
      await tx.facturaItem.deleteMany({ where: { facturaId: idFactura } });
      if (normalized.length) await tx.facturaItem.createMany({ data: normalized });
    });

    return this.getInvoiceOrFail(idFactura);
  }

  async list(q: QueryInvoicesDto) {
    const page = q.page ? Number(q.page) : 1;
    const limit = q.limit ? Number(q.limit) : 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (q.proveedorId) where.proveedorId = this.toBigInt(q.proveedorId, 'proveedorId');
    if (q.bodegaId) where.bodegaId = this.toBigInt(q.bodegaId, 'bodegaId');
    if (q.status) where.status = q.status;

    if (q.from || q.to) {
      const from = q.from ? new Date(q.from) : undefined;
      let toEx: Date | undefined;
      if (q.to) { const d = new Date(q.to); d.setDate(d.getDate() + 1); toEx = d; }
      where.fecha = {
        ...(from ? { gte: from } : {}),
        ...(toEx ? { lt: toEx } : {}),
      };
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.factura.count({ where }),
      this.prisma.factura.findMany({
        where,
        orderBy: { fecha: 'desc' },
        skip, take: limit,
        include: { proveedor: true, bodega: true, _count: { select: { items: true } } },
      }),
    ]);

    return { meta: { page, limit, total, pages: Math.ceil(total / limit) }, items };
  }

  async getById(id: string) {
    return this.getInvoiceOrFail(this.toBigInt(id, 'id'));
  }

  /**
   * CONFIRM:
   * - Factura DRAFT
   * - Debe tener items
   * - Upsert stock y crear movimientos IN
   * - Marcar factura CONFIRMED
   */
  async confirm(id: string, userId: string, observacion?: string) {
    const idFactura = this.toBigInt(id, 'id');
    const confirmedById = this.toBigInt(userId, 'userId');

    const inv = await this.getInvoiceOrFail(idFactura);
    if (inv.status !== 'DRAFT') throw new BadRequestException('Solo se puede confirmar en estado DRAFT.');
    if (!inv.items.length) throw new BadRequestException('No puedes confirmar una factura sin items.');

    await this.prisma.$transaction(async (tx) => {
      // crear movimientos + actualizar stock
      for (const it of inv.items) {
        // stock upsert por bodega+producto+unidad (sin conversiones por ahora)
        await tx.inventarioStock.upsert({
          where: {
            bodegaId_productoId_unidadId: {
              bodegaId: inv.bodegaId,
              productoId: it.productoId,
              unidadId: it.unidadId,
            },
          },
          create: {
            bodegaId: inv.bodegaId,
            productoId: it.productoId,
            unidadId: it.unidadId,
            cantidad: it.cantidad,
          },
          update: {
            cantidad: { increment: it.cantidad },
          },
        });

        await tx.inventarioMovimiento.create({
          data: {
            type: InventoryMoveType.IN,
            bodegaId: inv.bodegaId,
            productoId: it.productoId,
            unidadId: it.unidadId,
            cantidad: it.cantidad,
            referencia: `INVOICE:${inv.idFactura.toString()}`,
            facturaId: inv.idFactura,
            createdById: confirmedById,
          },
        });
      }

      await tx.factura.update({
        where: { idFactura: inv.idFactura },
        data: {
          status: InvoiceStatus.CONFIRMED,
          confirmedById,
          confirmedAt: new Date(),
          observacion: observacion?.trim() || inv.observacion,
        },
      });
    });

    return this.getInvoiceOrFail(idFactura);
  }

  /**
   * CANCEL:
   * - Factura CONFIRMED
   * - Revertir stock (decrement)
   * - Crear movimientos OUT
   * - Marcar CANCELED
   */
  async cancel(id: string, userId: string, reason: string) {
    const idFactura = this.toBigInt(id, 'id');
    const canceledById = this.toBigInt(userId, 'userId');

    const inv = await this.getInvoiceOrFail(idFactura);
    if (inv.status !== 'CONFIRMED') throw new BadRequestException('Solo se puede cancelar una factura CONFIRMED.');

    await this.prisma.$transaction(async (tx) => {
      for (const it of inv.items) {
        const stock = await tx.inventarioStock.findUnique({
          where: {
            bodegaId_productoId_unidadId: {
              bodegaId: inv.bodegaId,
              productoId: it.productoId,
              unidadId: it.unidadId,
            },
          },
        });
        if (!stock) throw new BadRequestException('No existe stock para revertir.');
        if (stock.cantidad.lt(it.cantidad)) {
          throw new BadRequestException(
            `Stock insuficiente para cancelar (productoId=${it.productoId.toString()}).`,
          );
        }

        await tx.inventarioStock.update({
          where: { idInventarioStock: stock.idInventarioStock },
          data: { cantidad: { decrement: it.cantidad } },
        });

        await tx.inventarioMovimiento.create({
          data: {
            type: InventoryMoveType.OUT,
            bodegaId: inv.bodegaId,
            productoId: it.productoId,
            unidadId: it.unidadId,
            cantidad: it.cantidad,
            referencia: `CANCEL_INVOICE:${inv.idFactura.toString()}`,
            facturaId: inv.idFactura,
            createdById: canceledById,
          },
        });
      }

      await tx.factura.update({
        where: { idFactura: inv.idFactura },
        data: {
          status: InvoiceStatus.CANCELED,
          canceledById,
          canceledAt: new Date(),
          cancelReason: reason.trim(),
        },
      });
    });

    return this.getInvoiceOrFail(idFactura);
  }

  async updateHeader(id: string, dto: any) {
    const idFactura = this.toBigInt(id, 'id');
    const inv = await this.getInvoiceOrFail(idFactura);

    if (inv.status !== 'DRAFT') {
        throw new BadRequestException('Solo puedes editar la cabecera en estado DRAFT.');
    }

    const data: any = {};

    if (dto.bodegaId !== undefined) {
        const bodegaId = this.toBigInt(dto.bodegaId, 'bodegaId');
        const bod = await this.prisma.bodega.findUnique({ where: { idBodega: bodegaId } });
        if (!bod || !bod.activo) throw new BadRequestException('Bodega no existe o está inactiva.');
        data.bodegaId = bodegaId;
    }

    if (dto.numero !== undefined) {
        const numero = String(dto.numero).trim();
        if (!numero) throw new BadRequestException('numero inválido');

        // Evitar choque con @@unique([proveedorId, numero])
        const dup = await this.prisma.factura.findFirst({
        where: {
            proveedorId: inv.proveedorId,
            numero,
            NOT: { idFactura: inv.idFactura },
        },
        });
        if (dup) throw new BadRequestException('Ya existe una factura con ese número para este proveedor.');

        data.numero = numero;
    }

    if (dto.fecha !== undefined) {
        data.fecha = new Date(dto.fecha);
    }

    if (dto.observacion !== undefined) {
        data.observacion = dto.observacion?.trim() || null;
    }

    await this.prisma.factura.update({
        where: { idFactura: inv.idFactura },
        data,
    });

    return this.getInvoiceOrFail(idFactura);

    }

    async removeItem(invoiceId: string, itemId: string) {
    const idFactura = this.toBigInt(invoiceId, 'invoiceId');
    const idFacturaItem = this.toBigInt(itemId, 'itemId');

    const inv = await this.getInvoiceOrFail(idFactura);
    if (inv.status !== 'DRAFT') {
        throw new BadRequestException('Solo puedes borrar items en estado DRAFT.');
    }

    const item = await this.prisma.facturaItem.findUnique({
        where: { idFacturaItem },
    });

    if (!item || item.facturaId !== idFactura) {
        throw new NotFoundException('Item no encontrado en esta factura.');
    }

    await this.prisma.facturaItem.delete({
        where: { idFacturaItem },
    });

    return this.getInvoiceOrFail(idFactura);
  }

}
