import { Module } from '@nestjs/common';
import { SecureController } from './secure.controller';
import { RolesGuard } from '../common/guards/roles.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';

/**
 * Módulo solo para endpoints de prueba de seguridad.
 * Los Guards están como providers para que Nest pueda inyectarlos.
 */
@Module({
  controllers: [SecureController],
  providers: [RolesGuard, PermissionsGuard],
})
export class SecureModule {}
