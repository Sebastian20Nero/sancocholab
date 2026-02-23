import { BadRequestException, Injectable, NotFoundException  } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  /**
   * Registro público:
   * - El correo es el "usuario" único
   * - Crea Persona + Usuario
   * - Asigna rol OPERADOR por defecto
   * - Devuelve respuesta segura (NO passwordHash)
   */
  async registerPublic(input: {
    nombres: string;
    apellidos: string;
    correo: string;
    celular: string;
    password: string;
  }) {
    const correo = input.correo.trim().toLowerCase();

    // Regla negocio: correo no se repite
    const persona = await this.repo.findPersonaByCorreo(correo);
    if (persona) throw new BadRequestException('El correo ya existe');

    // Hash de contraseña
    const passwordHash = await bcrypt.hash(input.password, 10);

    // Crear persona + usuario
    const usuario = await this.repo.createPersonaYUsuario({
      nombres: input.nombres,
      apellidos: input.apellidos,
      correo,
      celular: input.celular,
      passwordHash,
    });

    // ✅ Rol por defecto (lo que pediste)
    await this.repo.assignRolToUsuario(usuario.idUsuario, 'OPERADOR');

    // Respuesta segura (DTO)
    return {
      idUsuario: usuario.idUsuario.toString(),
      correo: usuario.persona.correo,
      nombres: usuario.persona.nombres,
      apellidos: usuario.persona.apellidos,
      celular: usuario.persona.celular,
      activo: usuario.activo,
      createdAt: usuario.createdAt,
    };
  }

  list() {
    return this.repo.listUsuarios();
  }

   /**
   * Retorna DTO para /users/me
   */
  async me(userId: string) {
    const idUsuario = BigInt(userId);
    const data = await this.repo.getMeWithEffectivePerms(idUsuario);
    if (!data) throw new NotFoundException('Usuario no existe');

    // DTO seguro
    return {
      idUsuario: data.idUsuario.toString(),
      correo: data.correo,
      nombres: data.nombres,
      apellidos: data.apellidos,
      celular: data.celular,
      activo: data.activo,
      roles: data.roles,
      permisosEfectivos: data.permisosEfectivos,
      overrides: data.overrides,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
