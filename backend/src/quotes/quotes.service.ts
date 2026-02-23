import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuotesRepository } from './quotes.repository';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UnitConversionService } from '../unit-conversion/unit-conversion.service';
@Injectable()
export class QuotesService {
  constructor(
    private repo: QuotesRepository,
    private prisma: PrismaService,
    private unitConv: UnitConversionService,
  ) { }

  /**
   * Crea una cotización:
   * - valida existencia proveedor/producto/unidad
   * - guarda auditoría createdById
   */
  async create(dto: CreateQuoteDto, userId: string) {
    const proveedorId = BigInt(dto.proveedorId);
    const productoId = BigInt(dto.productoId);
    const unidadIdRaw = BigInt(dto.unidadId);
    const createdById = BigInt(userId);

    // Validaciones de existencia
    const [prov, prod, uni] = await Promise.all([
      this.prisma.proveedor.findUnique({ where: { idProveedor: proveedorId } }),
      this.prisma.producto.findUnique({ where: { idProducto: productoId } }),
      this.prisma.unidadMedida.findUnique({ where: { idUnidadMedida: unidadIdRaw } }),
    ]);

    if (!prov || !prov.activo) throw new BadRequestException('Proveedor no existe o está inactivo');
    if (!prod || !prod.activo) throw new BadRequestException('Producto no existe o está inactivo');
    if (!uni || !uni.activo) throw new BadRequestException('Unidad no existe o está inactiva');

    // Decimals seguros
    let precioRaw: Prisma.Decimal;
    let cantidadRaw: Prisma.Decimal;
    try {
      precioRaw = new Prisma.Decimal(dto.precioUnitario);
      cantidadRaw = new Prisma.Decimal(dto.cantidad);
    } catch {
      throw new BadRequestException('precioUnitario o cantidad inválidos (decimal string).');
    }

    if (cantidadRaw.lte('0')) throw new BadRequestException('cantidad debe ser > 0');
    if (precioRaw.lt('0')) throw new BadRequestException('precioUnitario no puede ser negativo');

    // ✅ Normalizar (OPCIÓN A)
    const normalized = await this.unitConv.normalizeIfPossible({
      unidadId: unidadIdRaw,
      cantidad: cantidadRaw,
    });

    // ✅ Ajustar precio unitario a unidad canónica (inverso del factor)
    // factor = normalized.cantidad / cantidadRaw   (ej: 1g -> 0.001kg => factor=0.001)
    const factor = normalized.cantidad.div(cantidadRaw);
    const precioCanon = factor.eq('1') ? precioRaw : precioRaw.div(factor);

    const data: Prisma.CotizacionCreateInput = {
      proveedor: { connect: { idProveedor: proveedorId } },
      producto: { connect: { idProducto: productoId } },
      unidad: { connect: { idUnidadMedida: normalized.unidadId } }, // ✅ canónica
      precioUnitario: precioCanon, // ✅ ajustado
      cantidad: normalized.cantidad, // ✅ canónica
      fecha: new Date(dto.fecha),
      observacion: dto.observacion?.trim() || null,
      activo: true,
      createdBy: { connect: { idUsuario: createdById } },
    };

    return this.repo.create(data);
  }

  // src/quotes/quotes.service.ts
  async list(params: {
    proveedorId?: string;
    productoId?: string;
    categoriaId?: string;
    from?: string;
    to?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const where: any = { activo: true };

    if (params.proveedorId) where.proveedorId = BigInt(params.proveedorId);
    if (params.productoId) where.productoId = BigInt(params.productoId);

    // ✅ Filtro por categoría via join anidado de Prisma
    if (params.categoriaId) {
      where.producto = { categoriaId: BigInt(params.categoriaId) };
    }

    const start = params.from ?? params.dateFrom;
    const end = params.to ?? params.dateTo;

    if (start || end) {
      where.fecha = {};
      if (start) where.fecha.gte = new Date(start);

      if (end) {
        const endExclusive = new Date(end);
        endExclusive.setDate(endExclusive.getDate() + 1);
        where.fecha.lt = endExclusive;
      }
    }

    const items = await this.repo.findMany(where);

    // ✅ respuesta lista para front (ya viene en unidad canónica si create() normaliza)
    return items.map((q: any) => ({
      idCotizacion: q.idCotizacion?.toString?.() ?? String(q.idCotizacion),
      fecha: q.fecha,
      precioUnitario: q.precioUnitario?.toString?.() ?? String(q.precioUnitario),
      cantidad: q.cantidad?.toString?.() ?? String(q.cantidad),
      activo: q.activo === true,

      proveedorId: q.proveedorId?.toString?.() ?? String(q.proveedorId),
      proveedorNombre: q.proveedor?.nombre ?? null,

      productoId: q.productoId?.toString?.() ?? String(q.productoId),
      productoNombre: q.producto?.nombre ?? null,

      categoriaId: q.producto?.categoria?.idCategoria?.toString?.() ?? null,
      categoriaNombre: q.producto?.categoria?.nombre ?? null,

      unidadId: q.unidadId?.toString?.() ?? String(q.unidadId),
      unidadKey: q.unidad?.key ?? null,
      unidadNombre: q.unidad?.nombre ?? null,
    }));
  }



  async getById(id: string) {
    const item = await this.repo.findById(BigInt(id));
    if (!item) throw new NotFoundException('Cotización no existe');
    return item;
  }

  async latest(filter: { proveedorId?: string; productoId?: string; take?: string }) {
    if (!filter.proveedorId && !filter.productoId) {
      throw new BadRequestException('Debes enviar proveedorId o productoId');
    }
    return this.repo.latestByFilter({
      proveedorId: filter.proveedorId ? BigInt(filter.proveedorId) : undefined,
      productoId: filter.productoId ? BigInt(filter.productoId) : undefined,
      take: filter.take ? Number(filter.take) : 20,
    });
  }

  async bestPrice(productoId: string) {
    const best = await this.repo.bestPriceForProduct(BigInt(productoId));
    if (!best) throw new NotFoundException('No hay cotizaciones para este producto');
    return best;
  }

  /**
   * Actualiza una cotización existente
   * - valida existencia de la cotización
   * - valida unidad si se proporciona
   * - actualiza campos permitidos
   * - guarda auditoría updatedById
   */
  async update(id: string, dto: UpdateQuoteDto, userId: string) {
    const idCotizacion = BigInt(id);
    const updatedById = BigInt(userId);

    // Verificar que la cotización existe
    const existing = await this.repo.findById(idCotizacion);
    if (!existing) throw new NotFoundException('Cotización no existe');

    const updateData: Prisma.CotizacionUpdateInput = {
      updatedBy: { connect: { idUsuario: updatedById } },
    };

    // Validar y actualizar unidad si se proporciona
    if (dto.unidadId) {
      if (dto.unidadId === 'undefined' || dto.unidadId === 'null' || !/^\d+$/.test(dto.unidadId)) {
        throw new BadRequestException('unidadId inválido: debe ser un número entero');
      }
      const unidadIdRaw = BigInt(dto.unidadId);
      const uni = await this.prisma.unidadMedida.findUnique({
        where: { idUnidadMedida: unidadIdRaw },
      });
      if (!uni || !uni.activo) {
        throw new BadRequestException('Unidad no existe o está inactiva');
      }
      updateData.unidad = { connect: { idUnidadMedida: unidadIdRaw } };
    }

    // Validar y actualizar cantidad
    if (dto.cantidad !== undefined) {
      let cantidadRaw: Prisma.Decimal;
      try {
        cantidadRaw = new Prisma.Decimal(dto.cantidad);
      } catch {
        throw new BadRequestException('cantidad inválida (decimal string).');
      }
      if (cantidadRaw.lte('0')) {
        throw new BadRequestException('cantidad debe ser > 0');
      }
      updateData.cantidad = cantidadRaw;
    }

    // Validar y actualizar precio unitario
    if (dto.precioUnitario !== undefined) {
      let precioRaw: Prisma.Decimal;
      try {
        precioRaw = new Prisma.Decimal(dto.precioUnitario);
      } catch {
        throw new BadRequestException('precioUnitario inválido (decimal string).');
      }
      if (precioRaw.lt('0')) {
        throw new BadRequestException('precioUnitario no puede ser negativo');
      }
      updateData.precioUnitario = precioRaw;
    }

    // ✅ Recalcular precioUnidad (precio normalizado por unidad canónica)
    // Es el campo que usa la pantalla de Recetas para mostrar el indicador de precio.
    // Necesitamos los valores finales de precioUnitario y cantidad (del DTO o del registro existente).
    {
      const precioFinal: Prisma.Decimal =
        (updateData.precioUnitario as Prisma.Decimal | undefined)
        ?? (existing as any).precioUnitario;
      const cantidadFinal: Prisma.Decimal =
        (updateData.cantidad as Prisma.Decimal | undefined)
        ?? (existing as any).cantidad;

      if (precioFinal && cantidadFinal && cantidadFinal.gt('0')) {
        updateData.precioUnidad = precioFinal.div(cantidadFinal);
      }
    }

    // Actualizar fecha si se proporciona
    if (dto.fecha) {
      updateData.fecha = new Date(dto.fecha);
    }

    // Actualizar observación si se proporciona
    if (dto.observacion !== undefined) {
      updateData.observacion = dto.observacion?.trim() || null;
    }

    return this.repo.update(idCotizacion, updateData);
  }

  /**
   * Inactiva una cotización (soft delete)
   * - valida existencia de la cotización
   * - marca como inactiva
   * - guarda auditoría updatedById
   */
  async deactivate(id: string, userId: string) {
    const idCotizacion = BigInt(id);
    const updatedById = BigInt(userId);

    // Verificar que la cotización existe
    const existing = await this.repo.findById(idCotizacion);
    if (!existing) throw new NotFoundException('Cotización no existe');

    const updateData: Prisma.CotizacionUpdateInput = {
      activo: false,
      updatedBy: { connect: { idUsuario: updatedById } },
    };

    return this.repo.update(idCotizacion, updateData);
  }
}
