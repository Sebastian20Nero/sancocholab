import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { REQUIRED_PERMS_KEY } from './require-perm.decorator';

/**
 * PermissionsGuard:
 * - Lee permisos requeridos por @RequirePerm(...)
 * - Calcula permisos efectivos del usuario:
 *    - Permisos por roles (RolPermiso -> Permiso)
 *    - Overrides por usuario (UsuarioPermiso.enabled true/false)
 * - ADMIN: puede pasar siempre (o si prefieres, por permisos; aquí es allow-all).
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1) Permisos requeridos por el endpoint (si no hay, dejamos pasar)
    const required = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    // 2) Usuario autenticado (JwtAuthGuard debe correr antes)
    const req = context.switchToHttp().getRequest();
    const user = req.user as { userId: string; roles?: string[] };

    if (!user?.userId) {
      throw new ForbiddenException('No autenticado');
    }

    // 3) ADMIN pasa todo (regla práctica)
    if (Array.isArray(user.roles) && user.roles.includes('ADMIN')) return true;

    // 4) Calcular permisos efectivos desde BD
    const usuarioId = BigInt(user.userId);

    const dbUser = await this.prisma.usuario.findUnique({
      where: { idUsuario: usuarioId },
      select: {
        // Permisos por roles
        roles: {
          select: {
            rol: {
              select: {
                permisos: {
                  select: { permiso: { select: { key: true, activo: true } } },
                },
              },
            },
          },
        },
        // Overrides por usuario
        permisos: {
          select: { enabled: true, permiso: { select: { key: true, activo: true } } },
        },
      },
    });

    if (!dbUser) {
      throw new ForbiddenException('Usuario no existe');
    }

    // --- Permisos base por roles ---
    const effective = new Set<string>();

    for (const ur of dbUser.roles) {
      for (const rp of ur.rol.permisos) {
        if (rp.permiso.activo) effective.add(rp.permiso.key);
      }
    }

    // --- Overrides por usuario (enabled true agrega; false quita) ---
    for (const up of dbUser.permisos) {
      if (!up.permiso.activo) continue;
      if (up.enabled) effective.add(up.permiso.key);
      else effective.delete(up.permiso.key);
    }

    // 5) Verificar que el usuario tenga TODOS los permisos requeridos
    const missing = required.filter((p) => !effective.has(p));
    if (missing.length > 0) {
      throw new ForbiddenException(
        `Permisos insuficientes. Faltan: ${missing.join(', ')}`,
      );
    }

    // 6) (Opcional) Adjuntar para que otros controladores no recalculen
    req.user.effectivePerms = Array.from(effective);

    return true;
  }
}
