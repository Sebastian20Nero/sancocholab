import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PotStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreatePotDto } from './dto/create-pot.dto';
import { UpdatePotDto } from './dto/update-pot.dto';
import { QueryPotsDto } from './dto/query-pots.dto';

@Injectable()
export class PotsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recipesService: RecipesService,
  ) { }

  private toBigInt(val: string, name: string) {
    if (!val || !/^\d+$/.test(val)) throw new BadRequestException(`${name} inválido: ${val}`);
    return BigInt(val);
  }

  private parseDecimal(val: string, name: string) {
    if (val === undefined || val === null) throw new BadRequestException(`${name} es requerido`);
    const s = String(val).trim();
    if (!/^\d+(\.\d+)?$/.test(s)) throw new BadRequestException(`${name} decimal inválido: ${val}`);
    return new Prisma.Decimal(s);
  }

  private async getOrFail(idOlla: bigint) {
    const item = await this.prisma.olla.findUnique({
      where: { idOlla },
      include: { receta: true, createdBy: true, updatedBy: true, closedBy: true },
    });
    if (!item) throw new NotFoundException('Olla no encontrada.');
    return item;
  }

  private async calculateRecipeSnapshot(recetaId: bigint, porciones: Prisma.Decimal) {
    const res = await this.recipesService.calculate(recetaId.toString(), {
      porciones: porciones.toString(),
      overrides: [],
    });

    const totalReceta = new Prisma.Decimal(res.totalReceta);
    const costoPorPorcion = res.costoPorPorcion ? new Prisma.Decimal(res.costoPorPorcion) : null;

    return { totalReceta, costoPorPorcion, snapshot: res };
  }

  async create(dto: CreatePotDto, userId: string) {
    const recetaId = this.toBigInt(dto.recetaId, 'recetaId');
    const createdById = this.toBigInt(userId, 'userId');
    const porciones = this.parseDecimal(dto.porciones, 'porciones');

    const receta = await this.prisma.receta.findUnique({ where: { idReceta: recetaId } });
    if (!receta || !receta.activo) throw new BadRequestException('Receta no existe o está inactiva.');

    const calc = await this.calculateRecipeSnapshot(recetaId, porciones);

    return this.prisma.olla.create({
      data: {
        recetaId,
        fecha: new Date(dto.fecha),
        porciones,
        status: PotStatus.OPEN,
        totalReceta: calc.totalReceta,
        costoPorPorcion: calc.costoPorPorcion ?? null,
        snapshot: calc.snapshot,
        notas: dto.notas?.trim() || null,
        createdById,
      },
      include: { receta: true },
    });
  }

  async findAll(q: QueryPotsDto) {
    const page = q.page ? Number(q.page) : 1;
    const limit = q.limit ? Number(q.limit) : 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (q.recetaId) where.recetaId = this.toBigInt(q.recetaId, 'recetaId');
    if (q.status) where.status = q.status;

    if (q.from || q.to) {
      where.fecha = {};
      if (q.from) where.fecha.gte = new Date(q.from);
      if (q.to) {
        const d = new Date(q.to);
        d.setDate(d.getDate() + 1);
        where.fecha.lt = d;
      }
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.olla.count({ where }),
      this.prisma.olla.findMany({
        where,
        include: { receta: true },
        orderBy: { fecha: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { meta: { page, limit, total, pages: Math.ceil(total / limit) }, items };
  }

  async findOne(id: string) {
    return this.getOrFail(this.toBigInt(id, 'id'));
  }

  async update(id: string, dto: UpdatePotDto, userId: string) {
    const idOlla = this.toBigInt(id, 'id');
    const updatedById = this.toBigInt(userId, 'userId');

    const pot = await this.getOrFail(idOlla);
    if (pot.status === PotStatus.CLOSED) throw new BadRequestException('La olla está cerrada. No se puede editar.');

    const data: any = {
      updatedById,
      ...(dto.fecha ? { fecha: new Date(dto.fecha) } : {}),
      ...(dto.notas !== undefined ? { notas: dto.notas?.trim() || null } : {}),
    };

    let recetaId = pot.recetaId;
    if (dto.recetaId) {
      recetaId = this.toBigInt(dto.recetaId, 'recetaId');
      const receta = await this.prisma.receta.findUnique({ where: { idReceta: recetaId } });
      if (!receta || !receta.activo) throw new BadRequestException('Receta no existe o está inactiva.');
      data.recetaId = recetaId;
    }

    let porciones = pot.porciones as unknown as Prisma.Decimal;
    if (dto.porciones) {
      porciones = this.parseDecimal(dto.porciones, 'porciones');
      data.porciones = porciones;
    }

    if (dto.recetaId || dto.porciones) {
      const calc = await this.calculateRecipeSnapshot(recetaId, porciones);
      data.totalReceta = calc.totalReceta;
      data.costoPorPorcion = calc.costoPorPorcion ?? null;
      data.snapshot = calc.snapshot;
    }

    await this.prisma.olla.update({ where: { idOlla }, data });
    return this.getOrFail(idOlla);
  }

  async close(id: string, userId: string, motivo?: string) {
    const idOlla = this.toBigInt(id, 'id');
    const closedById = this.toBigInt(userId, 'userId');

    const pot = await this.getOrFail(idOlla);
    if (pot.status === PotStatus.CLOSED) return pot;

    const calc = await this.calculateRecipeSnapshot(
      pot.recetaId,
      pot.porciones as unknown as Prisma.Decimal,
    );

    const snapshot: any =
      pot.snapshot && typeof pot.snapshot === 'object' ? { ...(pot.snapshot as any) } : {};
    snapshot.closeMotivo = motivo?.trim() || null;
    snapshot.closedAt = new Date().toISOString();

    await this.prisma.olla.update({
      where: { idOlla },
      data: {
        status: PotStatus.CLOSED,
        closedById,
        closedAt: new Date(),
        totalReceta: calc.totalReceta,
        costoPorPorcion: calc.costoPorPorcion ?? null,
        snapshot,
      },
    });

    return this.getOrFail(idOlla);
  }

  // ─────────────────────────────────────────────────────────────
  // OllaPedido — olla del día con múltiples recetas (raw tables)
  // ─────────────────────────────────────────────────────────────

  async createPedido(
    dto: { nombre: string; fecha: string; notas?: string; items: { recetaId: string; porciones: string }[] },
    userId: string,
  ) {
    const createdById = BigInt(userId);
    const fecha = new Date(dto.fecha);

    // 1. Calcular cada receta y capturar snapshot
    let totalCosto = new Prisma.Decimal('0');
    const itemsCalc: any[] = [];

    for (const it of dto.items) {
      try {
        const calc = await this.recipesService.calculate(it.recetaId, { porciones: it.porciones });
        const totalReceta = new Prisma.Decimal(calc.totalReceta);
        const costoPorPorcion = calc.costoPorPorcion ? new Prisma.Decimal(calc.costoPorPorcion) : null;
        totalCosto = totalCosto.add(totalReceta);
        itemsCalc.push({
          recetaId: BigInt(it.recetaId),
          porciones: new Prisma.Decimal(it.porciones),
          totalReceta,
          costoPorPorcion,
          snapshot: calc,
        });
      } catch {
        // Si no hay cotizaciones, guardar sin precios
        itemsCalc.push({
          recetaId: BigInt(it.recetaId),
          porciones: new Prisma.Decimal(it.porciones),
          totalReceta: null,
          costoPorPorcion: null,
          snapshot: null,
        });
      }
    }

    // 2. Insertar cabecera
    const rows = await this.prisma.$queryRaw<{ idOllaPedido: bigint }[]>`
      INSERT INTO "OllaPedido" ("nombre", "fecha", "notas", "totalCosto", "status", "createdById", "createdAt", "updatedAt")
      VALUES (${dto.nombre}, ${fecha}, ${dto.notas ?? null}, ${totalCosto.toString()}::numeric, 'GUARDADA', ${createdById}, NOW(), NOW())
      RETURNING "idOllaPedido"
    `;
    const idOllaPedido = rows[0].idOllaPedido;

    // 3. Insertar items
    for (const it of itemsCalc) {
      await this.prisma.$executeRaw`
        INSERT INTO "OllaPedidoItem"
          ("ollaPedidoId", "recetaId", "porciones", "totalReceta", "costoPorPorcion", "snapshot", "createdAt")
        VALUES (
          ${idOllaPedido},
          ${it.recetaId},
          ${it.porciones.toString()}::numeric,
          ${it.totalReceta ? it.totalReceta.toString() : null}::numeric,
          ${it.costoPorPorcion ? it.costoPorPorcion.toString() : null}::numeric,
          ${it.snapshot ? JSON.stringify(it.snapshot) : null}::jsonb,
          NOW()
        )
      `;
    }

    return this.findOnePedido(idOllaPedido.toString());
  }

  async listPedidos(params?: { page?: number; limit?: number; from?: string; to?: string }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const offset = (page - 1) * limit;
    const from = params?.from ? new Date(params.from) : null;
    const to = params?.to ? new Date(params.to + 'T23:59:59') : null;

    let rows: any[];
    let countRows: any[];

    if (from && to) {
      rows = await this.prisma.$queryRaw`
        SELECT op.*, COUNT(opi."idOllaPedidoItem")::int AS "itemCount"
        FROM "OllaPedido" op
        LEFT JOIN "OllaPedidoItem" opi ON opi."ollaPedidoId" = op."idOllaPedido"
        WHERE op."fecha" >= ${from} AND op."fecha" <= ${to}
        GROUP BY op."idOllaPedido"
        ORDER BY op."fecha" DESC, op."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countRows = await this.prisma.$queryRaw`
        SELECT COUNT(*)::int AS total FROM "OllaPedido" WHERE "fecha" >= ${from} AND "fecha" <= ${to}
      `;
    } else if (from) {
      rows = await this.prisma.$queryRaw`
        SELECT op.*, COUNT(opi."idOllaPedidoItem")::int AS "itemCount"
        FROM "OllaPedido" op
        LEFT JOIN "OllaPedidoItem" opi ON opi."ollaPedidoId" = op."idOllaPedido"
        WHERE op."fecha" >= ${from}
        GROUP BY op."idOllaPedido"
        ORDER BY op."fecha" DESC, op."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countRows = await this.prisma.$queryRaw`
        SELECT COUNT(*)::int AS total FROM "OllaPedido" WHERE "fecha" >= ${from}
      `;
    } else {
      rows = await this.prisma.$queryRaw`
        SELECT op.*, COUNT(opi."idOllaPedidoItem")::int AS "itemCount"
        FROM "OllaPedido" op
        LEFT JOIN "OllaPedidoItem" opi ON opi."ollaPedidoId" = op."idOllaPedido"
        GROUP BY op."idOllaPedido"
        ORDER BY op."fecha" DESC, op."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countRows = await this.prisma.$queryRaw`
        SELECT COUNT(*)::int AS total FROM "OllaPedido"
      `;
    }

    const total = Number(countRows[0]?.total ?? 0);
    const serialized = rows.map(r => ({
      ...r,
      idOllaPedido: r.idOllaPedido.toString(),
      createdById: r.createdById?.toString(),
      totalCosto: r.totalCosto ? r.totalCosto.toString() : null,
    }));

    return { meta: { page, limit, total, pages: Math.ceil(total / limit) }, items: serialized };
  }

  async findOnePedido(id: string) {
    const idBig = BigInt(id);
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT op.* FROM "OllaPedido" op WHERE op."idOllaPedido" = ${idBig}
    `;
    if (!rows.length) throw new NotFoundException('OllaPedido no encontrada.');

    const items = await this.prisma.$queryRaw<any[]>`
      SELECT opi.*, r.nombre AS "recetaNombre", r."porcionesBase"
      FROM "OllaPedidoItem" opi
      JOIN "Receta" r ON r."idReceta" = opi."recetaId"
      WHERE opi."ollaPedidoId" = ${idBig}
      ORDER BY opi."idOllaPedidoItem"
    `;

    const olla = rows[0];
    return {
      idOllaPedido: olla.idOllaPedido.toString(),
      nombre: olla.nombre,
      fecha: olla.fecha,
      notas: olla.notas,
      totalCosto: olla.totalCosto?.toString() ?? null,
      status: olla.status,
      createdAt: olla.createdAt,
      items: items.map(it => ({
        idOllaPedidoItem: it.idOllaPedidoItem.toString(),
        recetaId: it.recetaId.toString(),
        recetaNombre: it.recetaNombre,
        porciones: it.porciones?.toString() ?? null,
        totalReceta: it.totalReceta?.toString() ?? null,
        costoPorPorcion: it.costoPorPorcion?.toString() ?? null,
      })),
    };
  }
}
