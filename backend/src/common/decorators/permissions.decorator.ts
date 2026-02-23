import { SetMetadata } from '@nestjs/common';

/**
 * Clave interna de metadata para permisos.
 * El Guard la leerá con Reflector.
 */
export const PERMISSIONS_KEY = 'permissions_required';

/**
 * @Permissions('QUOTE_CREATE', 'PRODUCT_CREATE')
 * Indica que el endpoint requiere TODOS los permisos listados (AND).
 *
 * Si luego quieres que sea OR (cualquiera), se puede cambiar fácil.
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
