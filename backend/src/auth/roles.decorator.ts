import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key para roles requeridos.
 */
export const ROLES_KEY = 'roles';

/**
 * @Roles('ADMIN') -> indica que el endpoint requiere esos roles.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
