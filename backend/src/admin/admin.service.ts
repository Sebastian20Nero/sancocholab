import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';

/**
 * AdminService:
 * - Encapsula lógica admin (listar usuarios, roles, permisos delegables)
 * - Mantiene el controller delgado.
 */
@Injectable()
export class AdminService {
  constructor(private usersRepo: UsersRepository) {}

  async listUsers() {
    const users = await this.usersRepo.listUsuarios();

    // DTO seguro: NO devolver passwordHash
    return users.map((u) => ({
      idUsuario: u.idUsuario.toString(),
      correo: u.persona.correo,
      nombres: u.persona.nombres,
      apellidos: u.persona.apellidos,
      celular: u.persona.celular,
      activo: u.activo,
      roles: u.roles.map((ur) => ur.rol.nombre),
      // overrides puntuales (enabled true/false)
      permisosOverride: u.permisos.map((up) => ({
        key: up.permiso.key,
        enabled: up.enabled,
      })),
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }

  async setUserRoles(userId: bigint, roles: string[]) {
  const user = await this.usersRepo.findUsuarioById(userId);
  if (!user) throw new NotFoundException('Usuario no existe');

  const currentlyAdmin = (user.roles ?? []).some((ur: any) => ur.rol?.nombre === 'ADMIN');
  const willKeepAdmin = roles.includes('ADMIN');

  if (currentlyAdmin && !willKeepAdmin) {
    const activeAdmins = await this.usersRepo.countActiveAdmins();
    if (activeAdmins <= 1) {
      throw new NotFoundException('No puedes quitar ADMIN al último ADMIN activo');
    }
  }

  await this.usersRepo.setRolesToUsuario(userId, roles);
  return { ok: true, message: 'Roles actualizados', userId: userId.toString(), roles };
}


  async delegateUserPerms(userId: bigint, overrides: { key: string; enabled: boolean }[]) {
    const user = await this.usersRepo.findUsuarioById(userId);
    if (!user) throw new NotFoundException('Usuario no existe');

    await this.usersRepo.replaceUsuarioPermisos(userId, overrides);

    return { ok: true, message: 'Permisos delegados actualizados', userId: userId.toString() };
  }

  async listPermisos() {
    const perms = await this.usersRepo.listPermisos();
    return perms.map((p) => ({
      idPermiso: p.idPermiso.toString(),
      key: p.key,
      descripcion: p.descripcion,
      activo: p.activo,
    }));
  }

  async listRoles() {
    const roles = await this.usersRepo.listRoles();
    return roles.map((r) => ({
      idRol: r.idRol.toString(),
      nombre: r.nombre,
      descripcion: r.descripcion,
    }));
  }
   /**
   * Helper para devolver DTO seguro (sin passwordHash).
   */
  private toSafeUserDto(u: any) {
    return {
      idUsuario: u.idUsuario.toString(),
      correo: u.persona.correo,
      nombres: u.persona.nombres,
      apellidos: u.persona.apellidos,
      celular: u.persona.celular,
      activo: u.activo,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      roles: (u.roles ?? []).map((ur: any) => ur.rol.nombre),
      permisosOverride: (u.permisos ?? []).map((up: any) => ({
        key: up.permiso.key,
        enabled: up.enabled,
      })),
    };
  }

  /**
   * ✅ GET /admin/users/:id
   */
  async getUserById(idUsuario: bigint) {
    const u = await this.usersRepo.findUsuarioById(idUsuario);
    if (!u) throw new NotFoundException('Usuario no existe');
    return this.toSafeUserDto(u);
  }

  /**
   * ✅ GET /admin/users/by-email?correo=...
   */
  async getUserByEmail(correo: string) {
    const normalized = (correo ?? '').trim().toLowerCase();
    const u = await this.usersRepo.findUsuarioByCorreo(normalized);
    if (!u) throw new NotFoundException('Usuario no existe');
    return this.toSafeUserDto(u);
  }

  /**
   * ✅ PATCH /admin/users/:id/status
   */
  async setUserStatus(idUsuario: bigint, activo: boolean) {
  const u = await this.usersRepo.findUsuarioById(idUsuario);
  if (!u) throw new NotFoundException('Usuario no existe');

  if (activo === false) {
    const isAdmin = (u.roles ?? []).some((ur: any) => ur.rol?.nombre === 'ADMIN');
    if (isAdmin) {
      const activeAdmins = await this.usersRepo.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new NotFoundException('No puedes desactivar el último ADMIN activo');
      }
    }
  }

  const updated = await this.usersRepo.updateUsuarioActivo(idUsuario, activo);
  return {
    ok: true,
    message: 'Estado actualizado',
    user: this.toSafeUserDto(updated),
  };
}


  /**
   * ✅ PATCH /admin/users/:id/profile
   * Edita Persona (nombres/apellidos/celular).
   */
  async updateUserProfile(
    idUsuario: bigint,
    data: { nombres?: string; apellidos?: string; celular?: string },
  ) {
    const u = await this.usersRepo.findUsuarioById(idUsuario);
    if (!u) throw new NotFoundException('Usuario no existe');

    const personaUpdated = await this.usersRepo.updatePersonaByUsuarioId(idUsuario, data);
    if (!personaUpdated) throw new NotFoundException('Usuario no existe');

    // Devolvemos el usuario completo actualizado
    const u2 = await this.usersRepo.findUsuarioById(idUsuario);
    return {
      ok: true,
      message: 'Perfil actualizado',
      user: this.toSafeUserDto(u2),
    };
  }

  private async isUserAdmin(userId: bigint): Promise<boolean> {
    const u = await this.usersRepo.findUsuarioById(userId);
    if (!u) return false;
    return (u.roles ?? []).some((ur: any) => ur.rol?.nombre === 'ADMIN');
  }

  private async countActiveAdmins(): Promise<number> {
    // Ideal: que UsersRepository tenga un método directo con prisma.
    // Si no lo tienes, agrégalo en UsersRepository (te digo abajo).
    return this.usersRepo.countActiveAdmins();
  }  
}

