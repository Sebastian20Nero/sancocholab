import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AuthUser } from '../common/types/auth-user.type';

/**
 * Endpoints de prueba para validar Etapa 0 (Roles/Permisos).
 * No es “dominio”, solo sirve para verificar seguridad.
 */
@Controller('secure')
export class SecureController {
  /**
   * Requiere rol ADMIN.
   * Probamos: JwtAuthGuard -> RolesGuard.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  adminOnly() {
    return { ok: true, message: '✅ Acceso ADMIN concedido' };
  }

  /**
   * Requiere permiso QUOTE_CREATE.
   * Probamos: JwtAuthGuard -> PermissionsGuard.
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('QUOTE_CREATE')
  @Get('quote-create')
  quoteCreatePermission() {
    return { ok: true, message: '✅ Permiso QUOTE_CREATE concedido' };
  }
}
