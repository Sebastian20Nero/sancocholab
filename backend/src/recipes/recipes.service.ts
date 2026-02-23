// src/recipes/recipes.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ModoItemReceta } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UnitConversionService } from '../unit-conversion/unit-conversion.service';

/**
 * NOTA:
 * - Aquí tipéo los DTOs como "shapes" para que el archivo compile incluso si aún no creas DTOs.
 * - Si ya tienes DTOs en /dto, puedes reemplazar estos type por imports reales.
 */

type CreateRecipeDto = {
  nombre: string;
  categoriaId?: string;
  porcionesBase?: string; // Decimal string
};

type UpdateRecipeDto = {
  nombre?: string;
  categoriaId?: string; // permite cambiar categoría
  porcionesBase?: string; // Decimal string
};

type StatusRecipeDto = { activo: boolean };

type CreateRecipeItemDto = {
  productoId: string;
  unidadId: string;
  cantidad: string; // Decimal string
  modo?: ModoItemReceta | 'AUTO' | 'BY_PROVIDER' | 'HYPOTHETICAL';
  proveedorId?: string; // requerido si modo=BY_PROVIDER
};

type UpdateRecipeItemDto = {
  productoId?: string;
  unidadId?: string;
  cantidad?: string;
  modo?: ModoItemReceta | 'AUTO' | 'BY_PROVIDER' | 'HYPOTHETICAL';
  proveedorId?: string | null;
};

type ReplaceRecipeItemsDto = {
  items: CreateRecipeItemDto[];
};

type CalculateRecipeDto = {
  from?: string; // "2026-01-01" o ISO
  to?: string;   // "2026-01-31" o ISO
  porciones?: string;
  overrides?: Array<{
    productoId: string;
    precioUnitario: string; // Decimal string
  }>;
};

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService, private readonly unitConv: UnitConversionService,) { }

  // -----------------------------
  // Helpers
  // -----------------------------

  private toBigInt(id: string, fieldName: string) {
    if (!id || !/^\d+$/.test(String(id))) {
      throw new BadRequestException(
        `${fieldName} inválido, se esperaba id numérico. Recibido: ${id}`,
      );
    }
    return BigInt(id);
  }

  private normalizeModo(modo?: any): ModoItemReceta {
    if (!modo) return 'AUTO';
    const m = String(modo).toUpperCase();
    if (m === 'AUTO' || m === 'BY_PROVIDER' || m === 'HYPOTHETICAL') return m as ModoItemReceta;
    throw new BadRequestException(`modo inválido. Usa: AUTO | BY_PROVIDER | HYPOTHETICAL`);
  }

  private async assertCategoriaRecetaExistsAndActive(categoriaId: bigint) {
    const cat = await this.prisma.categoriaReceta.findUnique({
      where: { idCategoriaReceta: categoriaId },
      select: { idCategoriaReceta: true, activo: true },
    });
    if (!cat) throw new BadRequestException('Categoría de receta no existe.');
    if (!cat.activo) throw new BadRequestException('Categoría de receta está inactiva.');
  }

  private async assertProductoExistsAndActive(productoId: bigint) {
    const p = await this.prisma.producto.findUnique({
      where: { idProducto: productoId },
      select: { idProducto: true, activo: true, nombre: true },
    });
    if (!p) throw new BadRequestException('Producto no existe.');
    if (!p.activo) throw new BadRequestException('Producto está inactivo.');
    return p;
  }

  private async assertUnidadExistsAndActive(unidadId: bigint) {
    const u = await this.prisma.unidadMedida.findUnique({
      where: { idUnidadMedida: unidadId },
      select: { idUnidadMedida: true, activo: true, key: true },
    });
    if (!u) throw new BadRequestException('Unidad de medida no existe.');
    if (!u.activo) throw new BadRequestException('Unidad de medida está inactiva.');
    return u;
  }

  private async assertProveedorExistsAndActive(proveedorId: bigint) {
    const prov = await this.prisma.proveedor.findUnique({
      where: { idProveedor: proveedorId },
      select: { idProveedor: true, activo: true, nombre: true },
    });
    if (!prov) throw new BadRequestException('Proveedor no existe.');
    if (!prov.activo) throw new BadRequestException('Proveedor está inactivo.');
    return prov;
  }

  private async getRecipeOrFail(idReceta: bigint) {
    const recipe = await this.prisma.receta.findUnique({
      where: { idReceta },
      include: {
        categoria: true,
        items: {
          include: {
            producto: true,
            unidad: true,
            proveedor: true,
          },
          orderBy: { idRecetaItem: 'asc' },
        },
      },
    });
    if (!recipe) throw new NotFoundException('Receta no encontrada.');
    return recipe;
  }

  // -----------------------------
  // CRUD Recetas
  // -----------------------------

  async create(dto: CreateRecipeDto, userId: string) {
    const createdById = this.toBigInt(userId, 'userId');

    const nombre = dto.nombre?.trim();
    if (!nombre) throw new BadRequestException('nombre es requerido.');

    const dup = await this.prisma.receta.findUnique({ where: { nombre } });
    if (dup) throw new BadRequestException('Nombre de receta ya existe.');

    const categoriaId = dto.categoriaId ? this.toBigInt(dto.categoriaId, 'categoriaId') : undefined;
    if (categoriaId) await this.assertCategoriaRecetaExistsAndActive(categoriaId);

    const porcionesBase = dto.porcionesBase
      ? new Prisma.Decimal(dto.porcionesBase)
      : undefined;

    return this.prisma.receta.create({
      data: {
        nombre,
        categoriaId,
        porcionesBase,
        activo: true,
        createdById,
      },
      include: { categoria: true },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    q?: string;
    activo?: boolean;
    categoriaId?: string;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(params.activo === undefined ? {} : { activo: params.activo }),
      ...(params.q
        ? { nombre: { contains: params.q, mode: 'insensitive' } }
        : {}),
      ...(params.categoriaId
        ? { categoriaId: this.toBigInt(params.categoriaId, 'categoriaId') }
        : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.receta.count({ where }),
      this.prisma.receta.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categoria: true,
          _count: { select: { items: true } },
        },
      }),
    ]);

    return {
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
      items,
    };
  }

  async findOne(id: string) {
    const idReceta = this.toBigInt(id, 'id');
    return this.getRecipeOrFail(idReceta);
  }

  async update(id: string, dto: UpdateRecipeDto, userId: string) {
    const idReceta = this.toBigInt(id, 'id');
    const updatedById = this.toBigInt(userId, 'userId');

    await this.getRecipeOrFail(idReceta);

    if (dto.nombre) {
      const nombre = dto.nombre.trim();
      const dup = await this.prisma.receta.findFirst({
        where: { nombre, NOT: { idReceta } },
      });
      if (dup) throw new BadRequestException('Nombre de receta ya existe.');
    }

    let categoriaId: bigint | null | undefined = undefined;
    if (dto.categoriaId !== undefined) {
      if (dto.categoriaId === null || dto.categoriaId === '') {
        categoriaId = null; // permitir quitar categoría
      } else {
        categoriaId = this.toBigInt(dto.categoriaId, 'categoriaId');
        await this.assertCategoriaRecetaExistsAndActive(categoriaId);
      }
    }

    const porcionesBase =
      dto.porcionesBase !== undefined ? new Prisma.Decimal(dto.porcionesBase) : undefined;

    return this.prisma.receta.update({
      where: { idReceta },
      data: {
        ...(dto.nombre !== undefined ? { nombre: dto.nombre.trim() } : {}),
        ...(dto.categoriaId !== undefined ? { categoriaId } : {}),
        ...(dto.porcionesBase !== undefined ? { porcionesBase } : {}),
        updatedById,
      },
      include: { categoria: true },
    });
  }

  async setStatus(id: string, dto: StatusRecipeDto, userId: string) {
    const idReceta = this.toBigInt(id, 'id');
    const updatedById = this.toBigInt(userId, 'userId');

    await this.getRecipeOrFail(idReceta);

    return this.prisma.receta.update({
      where: { idReceta },
      data: {
        activo: dto.activo,
        updatedById,
      },
      include: { categoria: true },
    });
  }

  // -----------------------------
  // CRUD Items Receta
  // -----------------------------

  async addItem(recipeId: string, dto: CreateRecipeItemDto) {
    const recetaId = this.toBigInt(recipeId, 'recipeId');
    await this.getRecipeOrFail(recetaId);

    const productoId = this.toBigInt(dto.productoId, 'productoId');
    const unidadIdRaw = this.toBigInt(dto.unidadId, 'unidadId');
    const modo = this.normalizeModo(dto.modo);

    // Validaciones de existencia/estado
    await this.assertProductoExistsAndActive(productoId);
    await this.assertUnidadExistsAndActive(unidadIdRaw);

    let proveedorId: bigint | undefined = undefined;
    if (modo === 'BY_PROVIDER') {
      if (!dto.proveedorId) {
        throw new BadRequestException(
          'proveedorId es requerido cuando modo = BY_PROVIDER.',
        );
      }
      proveedorId = this.toBigInt(dto.proveedorId, 'proveedorId');
      await this.assertProveedorExistsAndActive(proveedorId);
    } else {
      // ✅ por seguridad: si no es BY_PROVIDER, ignoramos proveedorId
      proveedorId = undefined;
    }

    // ✅ validar Decimal con try/catch (si llega "abc", revienta)
    let cantidadRaw: Prisma.Decimal;
    try {
      cantidadRaw = new Prisma.Decimal(dto.cantidad);
    } catch {
      throw new BadRequestException('cantidad inválida (decimal string).');
    }
    if (cantidadRaw.lte('0')) throw new BadRequestException('cantidad debe ser > 0');

    // ✅ NORMALIZACIÓN (OPCIÓN A)
    const normalized = await this.unitConv.normalizeIfPossible({
      unidadId: unidadIdRaw,
      cantidad: cantidadRaw,
    });

    return this.prisma.recetaItem.create({
      data: {
        recetaId,
        productoId,
        unidadId: normalized.unidadId,
        cantidad: normalized.cantidad,
        proveedorId,
        modo,
      },
      include: { producto: true, unidad: true, proveedor: true },
    });
  }


  async replaceItems(recipeId: string, dto: ReplaceRecipeItemsDto) {
    const recetaId = this.toBigInt(recipeId, 'recipeId');
    await this.getRecipeOrFail(recetaId);

    if (!dto.items || !Array.isArray(dto.items)) {
      throw new BadRequestException('items debe ser un arreglo.');
    }

    // Validar todos antes de tocar DB
    const normalized = await Promise.all(
      dto.items.map(async (it, idx) => {
        const productoId = this.toBigInt(it.productoId, `items[${idx}].productoId`);
        const unidadIdRaw = this.toBigInt(it.unidadId, `items[${idx}].unidadId`);
        const modo = this.normalizeModo(it.modo);
        const cantidadRaw = new Prisma.Decimal(it.cantidad);

        if (cantidadRaw.lte('0')) {
          throw new BadRequestException(`items[${idx}].cantidad debe ser > 0`);
        }

        await this.assertProductoExistsAndActive(productoId);
        await this.assertUnidadExistsAndActive(unidadIdRaw);

        let proveedorId: bigint | null = null;
        if (modo === 'BY_PROVIDER') {
          if (!it.proveedorId) {
            throw new BadRequestException(`items[${idx}].proveedorId requerido para modo BY_PROVIDER`);
          }
          proveedorId = this.toBigInt(it.proveedorId, `items[${idx}].proveedorId`);
          await this.assertProveedorExistsAndActive(proveedorId);
        }

        const normalized = await this.unitConv.normalizeIfPossible({
          unidadId: unidadIdRaw,
          cantidad: cantidadRaw,
        });

        return {
          productoId,
          unidadId: normalized.unidadId,
          modo,
          cantidad: normalized.cantidad,
          proveedorId,
        };
      }),
    );

    // Reemplazo total en transacción: borrar y crear
    await this.prisma.$transaction(async (tx) => {
      await tx.recetaItem.deleteMany({ where: { recetaId } });
      if (normalized.length) {
        await tx.recetaItem.createMany({
          data: normalized.map((n) => ({
            recetaId,
            productoId: n.productoId,
            unidadId: n.unidadId,
            modo: n.modo,
            cantidad: n.cantidad,
            proveedorId: n.proveedorId ?? undefined,
          })),
        });
      }
    });

    // devolver receta con items
    return this.getRecipeOrFail(recetaId);
  }

  async updateItem(recipeId: string, itemId: string, dto: UpdateRecipeItemDto) {
    const recetaId = this.toBigInt(recipeId, 'recipeId');
    const idRecetaItem = this.toBigInt(itemId, 'itemId');

    // confirma existencia receta + item
    await this.getRecipeOrFail(recetaId);

    const existing = await this.prisma.recetaItem.findUnique({
      where: { idRecetaItem },
      select: {
        idRecetaItem: true,
        recetaId: true,
        modo: true,
        unidadId: true,
        cantidad: true,
        proveedorId: true,
      },
    });

    if (!existing || existing.recetaId !== recetaId) {
      throw new NotFoundException('Item no encontrado en esta receta.');
    }

    const data: any = {};

    // 1) productoId (si lo cambian)
    if (dto.productoId !== undefined) {
      const productoId = this.toBigInt(dto.productoId, 'productoId');
      await this.assertProductoExistsAndActive(productoId);
      data.productoId = productoId;
    }

    // 2) modo (si lo cambian)
    let modoFinal: ModoItemReceta = existing.modo;
    if (dto.modo !== undefined) {
      modoFinal = this.normalizeModo(dto.modo);
      data.modo = modoFinal;
    }

    // 3) proveedorId depende del modo
    if (dto.proveedorId !== undefined || dto.modo !== undefined) {
      if (modoFinal === 'BY_PROVIDER') {
        const provStr = dto.proveedorId === null ? null : dto.proveedorId ?? null;
        if (!provStr) {
          throw new BadRequestException(
            'proveedorId es requerido cuando modo = BY_PROVIDER.',
          );
        }
        const proveedorId = this.toBigInt(provStr, 'proveedorId');
        await this.assertProveedorExistsAndActive(proveedorId);
        data.proveedorId = proveedorId;
      } else {
        // si cambia a AUTO/HYPOTHETICAL, proveedorId se limpia
        data.proveedorId = null;
      }
    }

    // 4) unidadId y/o cantidad -> NORMALIZAR (OPCIÓN A)
    // Tomamos valores "finales" (si no vienen en dto, usamos existing)
    const unidadFinalRaw =
      dto.unidadId !== undefined
        ? this.toBigInt(dto.unidadId, 'unidadId')
        : existing.unidadId;

    // validar unidad si la intentan cambiar (o si viene dto.unidadId)
    if (dto.unidadId !== undefined) {
      await this.assertUnidadExistsAndActive(unidadFinalRaw);
    }

    let cantidadFinalRaw: Prisma.Decimal = existing.cantidad;
    if (dto.cantidad !== undefined) {
      try {
        cantidadFinalRaw = new Prisma.Decimal(dto.cantidad);
      } catch {
        throw new BadRequestException('cantidad inválida (decimal string).');
      }
      if (cantidadFinalRaw.lte('0')) {
        throw new BadRequestException('cantidad debe ser > 0');
      }
    }

    // Solo normalizamos si el request toca unidadId o cantidad
    if (dto.unidadId !== undefined || dto.cantidad !== undefined) {
      const normalized = await this.unitConv.normalizeIfPossible({
        unidadId: unidadFinalRaw,
        cantidad: cantidadFinalRaw,
      });

      data.unidadId = normalized.unidadId;
      data.cantidad = normalized.cantidad;
    }

    return this.prisma.recetaItem.update({
      where: { idRecetaItem },
      data,
      include: { producto: true, unidad: true, proveedor: true },
    });
  }


  async removeItem(recipeId: string, itemId: string) {
    const recetaId = this.toBigInt(recipeId, 'recipeId');
    const idRecetaItem = this.toBigInt(itemId, 'itemId');

    await this.getRecipeOrFail(recetaId);

    const existing = await this.prisma.recetaItem.findUnique({
      where: { idRecetaItem },
      select: { idRecetaItem: true, recetaId: true },
    });

    if (!existing || existing.recetaId !== recetaId) {
      throw new NotFoundException('Item no encontrado en esta receta.');
    }

    await this.prisma.recetaItem.delete({ where: { idRecetaItem } });
    return { ok: true };
  }

  // -----------------------------
  // Calculate (NO guarda resultados; solo calcula)
  // -----------------------------

  // -----------------------------
  // Calculate (NO guarda resultados; solo calcula)
  // -----------------------------

  async calculate(recipeId: string, dto: CalculateRecipeDto) {
    const idReceta = this.toBigInt(recipeId, 'recipeId');
    const recipe = await this.getRecipeOrFail(idReceta);

    // Map overrides: productoId -> precioUnitario (se asume precio por 1 unidad canónica)
    const overrides = new Map<string, Prisma.Decimal>();
    for (const o of dto.overrides ?? []) {
      const pid = String(o.productoId);
      try {
        overrides.set(pid, new Prisma.Decimal(o.precioUnitario));
      } catch {
        throw new BadRequestException(`override.precioUnitario inválido para productoId=${pid}`);
      }
    }

    const from = dto.from ? new Date(dto.from) : undefined;

    // Para incluir TODO el día "to": usamos rango [from, to+1día) con lt
    let toExclusive: Date | undefined;
    if (dto.to) {
      const d = new Date(dto.to);
      d.setDate(d.getDate() + 1);
      toExclusive = d;
    }

    // porcionesBase de la receta (si no hay, usar 1)
    const base = recipe.porcionesBase ?? new Prisma.Decimal('1');

    // si no envían porciones, calcula para porcionesBase
    const requested = dto.porciones ? new Prisma.Decimal(dto.porciones) : base;

    if (base.lte('0')) throw new BadRequestException('porcionesBase inválido en receta.');
    if (requested.lte('0')) throw new BadRequestException('porciones inválidas, debe ser > 0.');

    const factor = requested.div(base);

    let totalReceta = new Prisma.Decimal('0');
    const itemsOut: any[] = [];

    for (const item of recipe.items) {
      const productoIdStr = item.productoId.toString();

      let precioPorUnidad: Prisma.Decimal | null = null; // ✅ precio por 1 unidad canónica
      let source: any = null;

      // 1) override manda (se asume por unidad canónica)
      if (overrides.has(productoIdStr)) {
        precioPorUnidad = overrides.get(productoIdStr)!;
        source = { type: 'OVERRIDE' };
      } else {
        // 2) resolver por cotización según modo (✅ última activa por fecha)
        const baseWhere: any = {
          activo: true,
          productoId: item.productoId,
          unidadId: item.unidadId,
          ...(from || toExclusive
            ? {
              fecha: {
                ...(from ? { gte: from } : {}),
                ...(toExclusive ? { lt: toExclusive } : {}),
              },
            }
            : {}),
        };

        if (item.modo === 'BY_PROVIDER') {
          if (!item.proveedorId) {
            throw new BadRequestException(
              `Item ${item.idRecetaItem}: modo BY_PROVIDER requiere proveedorId.`,
            );
          }

          const q = await this.prisma.cotizacion.findFirst({
            where: { ...baseWhere, proveedorId: item.proveedorId },
            orderBy: { fecha: 'desc' }, // ✅ última activa por fecha
            select: {
              idCotizacion: true,
              precioUnidad: true,           // NEW: normalized price
              precioUnitario: true,         // LEGACY: package price
              cantidad: true,               // LEGACY: package quantity
              presentacionCompra: true,     // NEW: presentation info
              proveedorId: true,
              fecha: true,
            },
          });

          if (!q) {
            throw new NotFoundException(
              `No hay cotización para ${item.producto.nombre} (proveedor/unidad/rango).`,
            );
          }

          // NEW SYSTEM: Use precioUnidad if available
          if (q.precioUnidad) {
            precioPorUnidad = q.precioUnidad;
          } else {
            // FALLBACK: Legacy calculation
            if (q.cantidad.lte('0')) {
              throw new BadRequestException(
                `Cotización inválida (cantidad<=0) para ${item.producto.nombre}.`,
              );
            }
            precioPorUnidad = q.precioUnitario.div(q.cantidad);
          }

          source = {
            type: 'BY_PROVIDER',
            quoteId: q.idCotizacion.toString(),
            proveedorId: q.proveedorId.toString(),
            fecha: q.fecha,
            presentacion: q.presentacionCompra || null,  // NEW
            precioNormalizado: precioPorUnidad.toString(),
            paquete: q.precioUnidad ? null : {  // Only show for legacy
              cantidad: q.cantidad.toString(),
              precio: q.precioUnitario.toString(),
            },
          };
        } else {
          // AUTO o HYPOTHETICAL sin override: ✅ última activa por fecha (acuerdo)
          const q = await this.prisma.cotizacion.findFirst({
            where: baseWhere,
            orderBy: { fecha: 'desc' }, // ✅ última activa por fecha
            select: {
              idCotizacion: true,
              precioUnidad: true,           // NEW: normalized price
              precioUnitario: true,         // LEGACY: package price
              cantidad: true,               // LEGACY: package quantity
              presentacionCompra: true,     // NEW: presentation info
              proveedorId: true,
              fecha: true,
            },
          });

          if (!q) {
            throw new NotFoundException(
              `No hay cotización para ${item.producto.nombre} (unidad/rango).`,
            );
          }

          // NEW SYSTEM: Use precioUnidad if available
          if (q.precioUnidad) {
            precioPorUnidad = q.precioUnidad;
          } else {
            // FALLBACK: Legacy calculation
            if (q.cantidad.lte('0')) {
              throw new BadRequestException(
                `Cotización inválida (cantidad<=0) para ${item.producto.nombre}.`,
              );
            }
            precioPorUnidad = q.precioUnitario.div(q.cantidad);
          }

          source = {
            type: 'AUTO',
            quoteId: q.idCotizacion.toString(),
            proveedorId: q.proveedorId.toString(),
            fecha: q.fecha,
            presentacion: q.presentacionCompra || null,  // NEW
            precioNormalizado: precioPorUnidad.toString(),
            paquete: q.precioUnidad ? null : {  // Only show for legacy
              cantidad: q.cantidad.toString(),
              precio: q.precioUnitario.toString(),
            },
          };
        }
      }

      if (!precioPorUnidad) {
        throw new BadRequestException(`No se pudo resolver precio para item ${item.idRecetaItem}`);
      }

      // ✅ escala por porciones
      const cantidadEscalada = item.cantidad.mul(factor);

      // ✅ total item = precioPorUnidad * cantidadEscalada
      const totalItem = precioPorUnidad.mul(cantidadEscalada);
      totalReceta = totalReceta.add(totalItem);

      itemsOut.push({
        itemId: item.idRecetaItem.toString(),
        productoId: item.productoId.toString(),
        producto: item.producto.nombre,
        unidadId: item.unidadId.toString(),
        unidadKey: item.unidad.key,
        modo: item.modo,
        proveedorId: item.proveedorId ? item.proveedorId.toString() : null,
        cantidad: cantidadEscalada.toString(),
        precioUnitario: precioPorUnidad.toString(), // ✅ precio por 1 unidad canónica
        total: totalItem.toString(),
        source,
      });
    }

    const porciones =
      dto.porciones
        ? new Prisma.Decimal(dto.porciones)
        : recipe.porcionesBase ?? null;

    const costoPorPorcion = totalReceta.div(requested);

    return {
      receta: {
        id: recipe.idReceta.toString(),
        nombre: recipe.nombre,
        categoria: recipe.categoria?.nombre ?? null,
      },
      filtros: {
        from: dto.from ?? null,
        to: dto.to ?? null,
      },
      porciones: porciones ? porciones.toString() : null,
      totalReceta: totalReceta.toString(),
      costoPorPorcion: costoPorPorcion ? costoPorPorcion.toString() : null,
      items: itemsOut,
    };
  }

  // -----------------------------
  // Quote availability check
  // -----------------------------

  async checkQuoteAvailability(productoId: string, unidadKey: string) {
    const pidBig = this.toBigInt(productoId, 'productoId');

    // Find the unit by its key (KG, L, UND)
    const unit = await this.prisma.unidadMedida.findFirst({
      where: { key: unidadKey.toUpperCase(), activo: true },
      select: { idUnidadMedida: true },
    });

    if (!unit) {
      return { available: false, count: 0, quotes: [] };
    }

    // Get all active quotations for this product+unit, ordered by date desc
    const rows = await this.prisma.cotizacion.findMany({
      where: {
        productoId: pidBig,
        unidadId: unit.idUnidadMedida,
        activo: true,
      },
      orderBy: { fecha: 'desc' },
      select: {
        idCotizacion: true,
        precioUnidad: true,
        precioUnitario: true,
        cantidad: true,
        fecha: true,
        proveedor: { select: { idProveedor: true, nombre: true } },
      },
    });

    if (!rows.length) {
      return { available: false, count: 0, quotes: [] };
    }

    // Group by provider — keep the most recent quote per provider
    const byProvider = new Map<string, { proveedorId: string; proveedorNombre: string; lastDate: Date; precioUnidad: string }>();
    for (const r of rows) {
      const key = r.proveedor.idProveedor.toString();
      if (!byProvider.has(key)) {
        // Resolve normalized price
        let precio: Prisma.Decimal;
        if (r.precioUnidad) {
          precio = r.precioUnidad;
        } else {
          precio = r.cantidad.gt('0') ? r.precioUnitario.div(r.cantidad) : r.precioUnitario;
        }
        byProvider.set(key, {
          proveedorId: key,
          proveedorNombre: r.proveedor.nombre,
          lastDate: r.fecha,
          precioUnidad: precio.toFixed(2),
        });
      }
    }

    const quotes = Array.from(byProvider.values());

    return {
      available: true,
      count: quotes.length,
      quotes,
    };
  }

  // -----------------------------
  // Batch cost estimate (for recipe list)
  // -----------------------------

  async batchEstimate(ids: string[]): Promise<
    { id: string; nombre: string; porcionesBase: string | null; costoPorPorcion: string | null; totalReceta: string | null; available: boolean }[]
  > {
    const results: any[] = [];
    for (const id of ids) {
      try {
        const calc = await this.calculate(id, {});
        results.push({
          id,
          nombre: calc.receta.nombre,
          porcionesBase: calc.porciones,
          costoPorPorcion: calc.costoPorPorcion,
          totalReceta: calc.totalReceta,
          available: true,
        });
      } catch {
        try {
          const recipe = await this.prisma.receta.findUnique({
            where: { idReceta: this.toBigInt(id, 'id') },
            select: { nombre: true, porcionesBase: true },
          });
          results.push({
            id,
            nombre: recipe?.nombre ?? id,
            porcionesBase: recipe?.porcionesBase?.toString() ?? null,
            costoPorPorcion: null,
            totalReceta: null,
            available: false,
          });
        } catch {
          results.push({ id, nombre: id, porcionesBase: null, costoPorPorcion: null, totalReceta: null, available: false });
        }
      }
    }
    return results;
  }

}
