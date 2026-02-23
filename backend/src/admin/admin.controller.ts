import { Body, Controller, Get, Param, Put, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';
import { SetUserRolesDto } from './dto/set-user-roles.dto';
import { DelegateUserPermsDto } from './dto/delegate-user-perms.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

/**
 * AdminController:
 * - Protegido por JWT
 * - Solo ADMIN
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  /**
   * GET /admin/users
   * Lista usuarios (sin passwordHash)
   */
  @Get('users')
  listUsers() {
    return this.admin.listUsers();
  }

  /**
   * PUT /admin/users/:id/roles
   * Reemplaza los roles del usuario por los enviados.
   */
  @Put('users/:id/roles')
  setRoles(@Param('id') id: string, @Body() dto: SetUserRolesDto) {
    return this.admin.setUserRoles(BigInt(id), dto.roles);
  }

  /**
   * GET /admin/permisos
   * Lista todos los permisos activos disponibles.
   */
  @Get('permisos')
  listPermisos() {
    return this.admin.listPermisos();
  }

  @Get('roles')
  listRoles() {
    return this.admin.listRoles();
  }
  /**
   * PUT /admin/users/:id/permisos
   * Delegación de permisos por usuario (overrides).
   * overrides: [{ key, enabled }]
   */
  @Put('users/:id/permisos')
  delegatePerms(@Param('id') id: string, @Body() dto: DelegateUserPermsDto) {
    return this.admin.delegateUserPerms(BigInt(id), dto.overrides);
  }
  

  /**
   * ✅ GET /admin/users/by-email?correo=...
   * (Recomendado porque evita problemas con '@' en rutas.)
   */
  @Get('users/by-email')
  getUserByEmail(@Query('correo') correo: string) {
    return this.admin.getUserByEmail(correo);
  }

  /**
   * ✅ GET /admin/users/:id
   */
  @Get('users/:id')
  getUserById(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.admin.getUserById(id);
  }

  /**
   * ✅ PATCH /admin/users/:id/status
   * Activa/inactiva usuario.
   */
  @Patch('users/:id/status')
  setStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.admin.setUserStatus(BigInt(id), dto.activo);
  }

  /**
   * ✅ PATCH /admin/users/:id/profile
   * Edita Persona (nombres/apellidos/celular).
   */
  @Patch('users/:id/profile')
  updateProfile(@Param('id') id: string, @Body() dto: UpdateUserProfileDto) {
    return this.admin.updateUserProfile(BigInt(id), dto);
  }
}
