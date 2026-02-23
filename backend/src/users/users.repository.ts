import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Busca Persona por correo (es único)
   */
  findPersonaByCorreo(correo: string) {
    return this.prisma.persona.findUnique({ where: { correo } });
  }

  
  /**
   * Buscar rol por nombre ("ADMIN", "OPERADOR")
   */
  findRolByNombre(nombre: string) {
    return this.prisma.rol.findUnique({ where: { nombre } });
  }

  
  /**
   * Asigna un rol a un usuario (idempotente: no duplica)
   */
  async assignRolToUsuario(usuarioId: bigint, rolNombre: string) {
    const rol = await this.findRolByNombre(rolNombre);
    if (!rol) throw new BadRequestException(`Rol no existe: ${rolNombre}`);

    await this.prisma.usuarioRol.upsert({
      where: { usuarioId_rolId: { usuarioId, rolId: rol.idRol } },
      update: {},
      create: { usuarioId, rolId: rol.idRol },
    });
  }

  /**
   * Lista usuarios (útil para admin después)
   */
  listUsuarios() {
    return this.prisma.usuario.findMany({
      include: {
        persona: true,
        roles: { include: { rol: true } },
        permisos: { include: { permiso: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Crea Persona + Usuario en una transacción
   * (sin username, porque login = correo).
   */
  createPersonaYUsuario(input: {
    nombres: string;
    apellidos: string;
    correo: string;
    celular: string;
    passwordHash: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const persona = await tx.persona.create({
        data: {
          nombres: input.nombres,
          apellidos: input.apellidos,
          correo: input.correo,
          celular: input.celular,
          activo: true,
        },
      });

      const usuario = await tx.usuario.create({
        data: {
          personaId: persona.idPersona,
          passwordHash: input.passwordHash,
          activo: true,
        },
        include: { persona: true },
      });

      return usuario;
    });
  }

  /**
   * Reemplaza TODOS los roles del usuario por los enviados.
   * (más profesional para admin panel: estado determinístico)
   */
  async setRolesToUsuario(usuarioId: bigint, roles: string[]) {
    // Validar roles existentes
    const dbRoles = await this.prisma.rol.findMany({
      where: { nombre: { in: roles } },
    });

    const found = new Set(dbRoles.map((r) => r.nombre));
    const missing = roles.filter((r) => !found.has(r));
    if (missing.length) {
      throw new BadRequestException(`Roles no existen: ${missing.join(', ')}`);
    }

    await this.prisma.$transaction(async (tx) => {
      // borrar los roles actuales
      await tx.usuarioRol.deleteMany({ where: { usuarioId } });

      // asignar los nuevos
      await tx.usuarioRol.createMany({
        data: dbRoles.map((r) => ({ usuarioId, rolId: r.idRol })),
        skipDuplicates: true,
      });
    });
  }

  /**
   * Añade un rol (idempotente)
   */
  async addRolToUsuario(usuarioId: bigint, rolNombre: string) {
    const rol = await this.findRolByNombre(rolNombre);
    if (!rol) throw new BadRequestException(`Rol no existe: ${rolNombre}`);

    await this.prisma.usuarioRol.upsert({
      where: { usuarioId_rolId: { usuarioId, rolId: rol.idRol } },
      update: {},
      create: { usuarioId, rolId: rol.idRol },
    });
  }

  // =========================
  // Permisos (delegación por usuario)
  // =========================

  listPermisos() {
    return this.prisma.permiso.findMany({
      where: { activo: true },
      orderBy: { key: 'asc' },
    });
  }

  findPermisosByKeys(keys: string[]) {
    return this.prisma.permiso.findMany({
      where: { key: { in: keys }, activo: true },
    });
  }

  /**
   * Upsert de overrides por usuario (UsuarioPermiso):
   * - enabled=true: habilita (aunque no esté en rol)
   * - enabled=false: bloquea (aunque el rol lo tenga)
   */
  async replaceUsuarioPermisos(
  usuarioId: bigint,
  overrides: { key: string; enabled: boolean }[],
) {
  // normaliza + dedupe (último gana)
  const map = new Map<string, boolean>();
  for (const o of overrides) map.set(o.key.trim().toUpperCase(), o.enabled);

  const normalized = Array.from(map.entries()).map(([key, enabled]) => ({ key, enabled }));
  const keys = normalized.map((o) => o.key);

  // IMPORTANTE: buscar solo permisos activos
  const permisos = await this.prisma.permiso.findMany({
    where: { key: { in: keys }, activo: true },
  });

  const found = new Set(permisos.map((p) => p.key));
  const missing = keys.filter((k) => !found.has(k));
  if (missing.length) {
    throw new BadRequestException(`Permisos no existen o inactivos: ${missing.join(', ')}`);
  }

  await this.prisma.$transaction(async (tx) => {
    await tx.usuarioPermiso.deleteMany({ where: { usuarioId } });

    await tx.usuarioPermiso.createMany({
      data: permisos.map((p) => {
        const enabled = normalized.find((o) => o.key === p.key)!.enabled;
        return { usuarioId, permisoId: p.idPermiso, enabled };
      }),
      skipDuplicates: true,
    });
  });
}


  /**
   * ✅ Busca usuario por correo (login/admin).
   * Incluye persona, roles, y overrides (UsuarioPermiso).
   */
  findUsuarioByCorreo(correo: string) {
    return this.prisma.usuario.findFirst({
      where: { persona: { correo } },
      include: {
        persona: true,
        roles: { include: { rol: true } },
        permisos: { include: { permiso: true } },
      },
    });
  }

  /**
   * ✅ Busca usuario por ID (admin).
   */
  findUsuarioById(idUsuario: bigint) {
    return this.prisma.usuario.findUnique({
      where: { idUsuario },
      include: {
        persona: true,
        roles: { include: { rol: true } },
        permisos: { include: { permiso: true } },
      },
    });
  }

  /**
   * ✅ Cambia estado activo/inactivo del usuario.
   * Importante:
   * - No borra nada.
   * - Este flag se valida en login para impedir acceso.
   */
  updateUsuarioActivo(idUsuario: bigint, activo: boolean) {
    return this.prisma.usuario.update({
      where: { idUsuario },
      data: { activo },
      include: {
        persona: true,
        roles: { include: { rol: true } },
        permisos: { include: { permiso: true } },
      },
    });
  }

  async listRoles() {
    return this.prisma.rol.findMany({ orderBy: { nombre: 'asc' } });
  }
  /**
   * ✅ Actualiza datos de Persona del usuario.
   * Usa transacción para evitar inconsistencias.
   */
  async updatePersonaByUsuarioId(
    idUsuario: bigint,
    data: { nombres?: string; apellidos?: string; celular?: string },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({
        where: { idUsuario },
        select: { personaId: true },
      });

      if (!usuario) return null;

      return tx.persona.update({
        where: { idPersona: usuario.personaId },
        data: {
          ...(data.nombres !== undefined ? { nombres: data.nombres } : {}),
          ...(data.apellidos !== undefined ? { apellidos: data.apellidos } : {}),
          ...(data.celular !== undefined ? { celular: data.celular } : {}),
        },
      });
    });
  }

  /**
   * Obtiene info del usuario logueado + roles + permisos efectivos.
   * - Permisos por rol: RolPermiso
   * - Overrides por usuario: UsuarioPermiso
   */
   /**
   * Obtiene info del usuario logueado + roles + permisos efectivos.
   * - Permisos por rol: RolPermiso -> Permiso
   * - Overrides por usuario: UsuarioPermiso.enabled true/false
   */
  async getMeWithEffectivePerms(idUsuario: bigint) {
    const u = await this.prisma.usuario.findUnique({
      where: { idUsuario },
      select: {
        idUsuario: true,
        activo: true,
        createdAt: true,
        updatedAt: true,

        // Datos básicos del usuario (vienen de Persona)
        persona: {
          select: {
            correo: true,
            nombres: true,
            apellidos: true,
            celular: true,
          },
        },

        /**
         * ✅ IMPORTANTE:
         * "roles" se define UNA sola vez y trae:
         * - nombre del rol
         * - permisos asociados a ese rol
         */
        roles: {
          select: {
            rol: {
              select: {
                nombre: true,
                permisos: {
                  select: {
                    permiso: { select: { key: true, activo: true } },
                  },
                },
              },
            },
          },
        },

        // Overrides por usuario (delegación granular)
        permisos: {
          select: {
            enabled: true,
            permiso: { select: { key: true, activo: true } },
          },
        },
      },
    });

    if (!u) return null;

    const roles = u.roles.map((x) => x.rol.nombre);
    const isAdmin = roles.includes('ADMIN');

    // Base: permisos por roles
    const effective = new Set<string>();
    for (const ur of u.roles) {
      for (const rp of ur.rol.permisos) {
        if (rp.permiso.activo) effective.add(rp.permiso.key);
      }
    }

    // Overrides: enabled=true agrega; enabled=false quita
    for (const up of u.permisos) {
      if (!up.permiso.activo) continue;
      if (up.enabled) effective.add(up.permiso.key);
      else effective.delete(up.permiso.key);
    }

    // DTO de salida (seguro)
    return {
      idUsuario: u.idUsuario,
      correo: u.persona.correo,
      nombres: u.persona.nombres,
      apellidos: u.persona.apellidos,
      celular: u.persona.celular,
      activo: u.activo,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      roles,
      permisosEfectivos: isAdmin ? ['ALL'] : Array.from(effective),
      overrides: u.permisos.map((x) => ({
        key: x.permiso.key,
        enabled: x.enabled,
      })),
    };
  }

  async countActiveAdmins(): Promise<number> {
  return this.prisma.usuario.count({
    where: {
      activo: true,
      roles: { some: { rol: { nombre: 'ADMIN' } } },
    },
  });
}


}
