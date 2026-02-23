import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from '../types/auth-user.type';

/**
 * RolesGuard:
 * - Lee @Roles() del handler o del controller
 * - Compara contra req.user.roles (inyectado por JwtStrategy)
 * - Si no coincide, devuelve 403
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // roles requeridos por el endpoint (si no hay, no se aplica restricción)
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    // Si el endpoint no tiene @Roles, no bloqueamos por rol
    if (requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthUser | undefined;

    // Si no existe req.user, es porque faltó JwtAuthGuard
    if (!user) {
      throw new ForbiddenException(
        'No autenticado: agrega JwtAuthGuard antes del RolesGuard',
      );
    }

    const userRoles = user.roles ?? [];

    // Regla: permitir si el usuario tiene al menos 1 rol requerido
    const hasAnyRole = requiredRoles.some((r) => userRoles.includes(r));

    if (!hasAnyRole) {
      throw new ForbiddenException(
        `Acceso denegado. Requiere rol: ${requiredRoles.join(' o ')}`,
      );
    }

    return true;
  }
}
