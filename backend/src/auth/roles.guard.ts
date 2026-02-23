import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/**
 * RolesGuard:
 * - Lee los roles requeridos desde metadata (@Roles)
 * - Compara contra req.user.roles (viene del JWT)
 *
 * IMPORTANTE:
 * - Si cambias roles de un usuario, debe volver a loguearse para que el token traiga roles nuevos.
 * - Si quieres que sea inmediato sin re-login, puedo darte versión que consulta roles en BD.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    // Si no hay roles requeridos, deja pasar
    if (requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const userRoles: string[] = user?.roles ?? [];

    return requiredRoles.some((r) => userRoles.includes(r));
  }
}
