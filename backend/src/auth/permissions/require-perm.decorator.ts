import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key interno para permisos requeridos.
 */
export const REQUIRED_PERMS_KEY = 'required_perms';

/**
 * Decorador para exigir permisos finos.
 * Ej:
 *   @UseGuards(JwtAuthGuard, PermissionsGuard)
 *   @RequirePerm('QUOTE_CREATE')
 *   @Get('...')
 */
export const RequirePerm = (...perms: string[]) => SetMetadata(REQUIRED_PERMS_KEY, perms);
