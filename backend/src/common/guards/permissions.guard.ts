import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthUser } from '../types/auth-user.type';

/**
 * PermissionsGuard:
 * - Lee @Permissions() del endpoint
 * - Calcula permisos efectivos del usuario:
 *   1) Permisos que vienen por Rol (RolPermiso -> Permiso)
 *   2) Overrides por Usuario (UsuarioPermiso.enabled)
 * - Regla de override:
 *   - Si existe override enabled=false -> DENY (bloquea aunque rol lo tenga)
 *   - Si existe override enabled=true  -> ALLOW (permite aunque rol no lo tenga)
 *   - Si no hay override -> depende del rol
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    // Si el endpoint no tiene @Permissions, no bloqueamos por permisos
    if (requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser | undefined;

    if (!user) {
      throw new ForbiddenException(
        'No autenticado: agrega JwtAuthGuard antes del PermissionsGuard',
      );
    }

    // En tu JWT Strategy, userId es string. En BD es BigInt.
    // Prisma acepta BigInt nativo.
    const userId = BigInt(user.userId);

    /**
     * Traemos de BD:
     * - roles del usuario
     * - permisos por rol
     * - overrides de permisos del usuario
     *
     * NOTA: esta consulta está pensada para ser clara.
     * Si más adelante quieres optimizar, se puede hacer con queries más directas.
     */
    const dbUser = await this.prisma.usuario.findUnique({
      where: { idUsuario: userId },
      select: {
        activo: true,

        // Overrides por usuario
        permisos: {
          select: {
            enabled: true,
            permiso: { select: { key: true } },
          },
        },

        // Roles + permisos de roles
        roles: {
          select: {
            rol: {
              select: {
                nombre: true,
                permisos: {
                  select: {
                    permiso: { select: { key: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!dbUser || !dbUser.activo) {
      throw new ForbiddenException('Usuario inactivo o no existe');
    }

    // 1) Permisos por rol
    const rolePermissionKeys = new Set<string>();

    for (const ur of dbUser.roles) {
      const rol = ur.rol;
      for (const rp of rol.permisos) {
        rolePermissionKeys.add(rp.permiso.key);
      }
    }

    // 2) Overrides por usuario (mapa key -> enabled)
    const userOverrides = new Map<string, boolean>();
    for (const up of dbUser.permisos) {
      userOverrides.set(up.permiso.key, up.enabled);
    }

    // 3) Evaluación final (AND: requiere TODOS)
    // Si quieres que sea OR (cualquiera), lo cambiamos.
    for (const requiredKey of requiredPermissions) {
      const override = userOverrides.get(requiredKey);

      if (override === false) {
        throw new ForbiddenException(
          `Acceso denegado por override. Permiso bloqueado: ${requiredKey}`,
        );
      }

      if (override === true) {
        // permitido por override
        continue;
      }

      // Sin override: depende del rol
      const hasByRole = rolePermissionKeys.has(requiredKey);

      if (!hasByRole) {
        throw new ForbiddenException(
          `Acceso denegado. Falta permiso: ${requiredKey}`,
        );
      }
    }

    return true;
  }
}
