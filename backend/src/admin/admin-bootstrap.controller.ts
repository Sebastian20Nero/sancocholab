import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Headers,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';

/**
 * Bootstrap SOLO DEV/QA:
 * - Crea/promueve el primer ADMIN
 * - No usa JWT (porque todavía no existe admin)
 * - Se protege con x-bootstrap-secret
 */
@Controller('admin')
export class AdminBootstrapController {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private usersRepo: UsersRepository,
    private usersService: UsersService,
  ) {}

  @Post('bootstrap')
  async bootstrapAdmin(
    @Headers('x-bootstrap-secret') secret: string,
    @Body()
    dto: {
      nombres: string;
      apellidos: string;
      correo: string;
      celular: string;
      password: string;
    },
  ) {
    // 1) Bloquear en producción
    const env = (this.config.get<string>('NODE_ENV') ?? 'development').toLowerCase();
    if (env === 'production') {
      throw new ForbiddenException('Bootstrap deshabilitado en producción');
    }

    // 2) Validar secreto
    const expected = this.config.get<string>('BOOTSTRAP_SECRET');
    if (!expected || secret !== expected) {
      throw new ForbiddenException('Bootstrap secret inválido');
    }

    // 3) Rol ADMIN debe existir
    const adminRole = await this.prisma.rol.findUnique({ where: { nombre: 'ADMIN' } });
    if (!adminRole) throw new ConflictException('Rol ADMIN no existe. Ejecuta seed.');

    // 4) Si ya existe ADMIN, bloquea
    const existingAdmin = await this.prisma.usuarioRol.findFirst({
      where: { rolId: adminRole.idRol },
    });
    if (existingAdmin) throw new ConflictException('Ya existe un ADMIN. Bootstrap bloqueado.');

    // 5) Crear o promover usuario
    const correo = dto.correo.trim().toLowerCase();
    const existingUser = await this.usersRepo.findUsuarioByCorreo(correo);

    let usuarioId: bigint;

    if (existingUser) {
      usuarioId = existingUser.idUsuario;
    } else {
      // reusa registro público
      await this.usersService.registerPublic({
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        correo,
        celular: dto.celular,
        password: dto.password,
      });

      const created = await this.usersRepo.findUsuarioByCorreo(correo);
      if (!created) throw new ConflictException('No se pudo crear el usuario');
      usuarioId = created.idUsuario;
    }

    // 6) Promover ADMIN
    await this.usersRepo.addRolToUsuario(usuarioId, 'ADMIN');

    return { ok: true, message: '✅ Usuario promovido a ADMIN', correo };
  }
}
