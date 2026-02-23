import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, UnidadMedida } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitConversionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Convierte: cantidad_en_to = cantidad_en_from * factor
   * (según tu tabla: fromUnidadId -> toUnidadId con factor multiplicativo)
   */
  async convertAmount(opts: {
    cantidad: Prisma.Decimal;
    fromUnidadId: bigint;
    toUnidadId: bigint;
  }): Promise<Prisma.Decimal> {
    const { cantidad, fromUnidadId, toUnidadId } = opts;

    if (fromUnidadId === toUnidadId) return cantidad;

    const conv = await this.prisma.unidadConversion.findFirst({
      where: { fromUnidadId, toUnidadId, activo: true },
      select: { factor: true },
    });

    if (!conv) {
      throw new BadRequestException(
        `No existe conversión activa desde unidad ${fromUnidadId} hacia ${toUnidadId}.`,
      );
    }

    // cantidad * factor
    return cantidad.mul(conv.factor);
  }

  /**
   * Normaliza a una unidad canónica:
   * - Si es G -> KILO (según conversión)
   * - Si es ML -> L
   * Si no hay conversión hacia canónica, deja igual.
   *
   * IMPORTANTE: usa keys de UnidadMedida para encontrar IDs.
   */
  async normalizeIfPossible(opts: {
    unidadId: bigint;
    cantidad: Prisma.Decimal;
  }): Promise<{ unidadId: bigint; cantidad: Prisma.Decimal }> {
    const { unidadId, cantidad } = opts;

    const unidad = await this.prisma.unidadMedida.findUnique({
      where: { idUnidadMedida: unidadId },
      select: { idUnidadMedida: true, key: true },
    });

    if (!unidad) return { unidadId, cantidad };

    // Define tus canónicas (las que tú ya insertaste conversiones)
    const CANON_MASS = 'KILO';
    const CANON_VOL = 'L';

    // Si viene en G o KG, intenta llevar a KILO (si existe)
    if (unidad.key === 'G' || unidad.key === 'KG' || unidad.key === 'KILO') {
      const to = await this.findUnidadByKey(CANON_MASS);
      if (to && to.idUnidadMedida !== unidadId) {
        const newCantidad = await this.convertAmount({
          cantidad,
          fromUnidadId: unidadId,
          toUnidadId: to.idUnidadMedida,
        });
        return { unidadId: to.idUnidadMedida, cantidad: newCantidad };
      }
      return { unidadId, cantidad };
    }

    // Si viene en ML, intenta llevar a L (si existe)
    if (unidad.key === 'ML' || unidad.key === 'L') {
      const to = await this.findUnidadByKey(CANON_VOL);
      if (to && to.idUnidadMedida !== unidadId) {
        const newCantidad = await this.convertAmount({
          cantidad,
          fromUnidadId: unidadId,
          toUnidadId: to.idUnidadMedida,
        });
        return { unidadId: to.idUnidadMedida, cantidad: newCantidad };
      }
      return { unidadId, cantidad };
    }

    // Otras unidades (UND, CAJA, etc): no normalizamos
    return { unidadId, cantidad };
  }

  private async findUnidadByKey(key: string): Promise<Pick<UnidadMedida, 'idUnidadMedida' | 'key'> | null> {
    return this.prisma.unidadMedida.findFirst({
      where: { key, activo: true },
      select: { idUnidadMedida: true, key: true },
    });
  }
}
