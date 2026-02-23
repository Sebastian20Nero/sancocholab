import { SetMetadata } from '@nestjs/common';

/**
 * Clave interna de metadata para roles.
 * El Guard la leerá con Reflector.
 */
export const ROLES_KEY = 'roles_required';

/**
 * @Roles('ADMIN', 'OPERADOR')
 * Indica que el endpoint requiere al menos UNO de esos roles.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
