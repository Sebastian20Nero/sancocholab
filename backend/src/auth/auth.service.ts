import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/users.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { generateResetToken, hashToken } from './password-reset.util';
import { UserTokenType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private repo: UsersRepository,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(correo: string, password: string) {
    const email = correo.trim().toLowerCase();
    const user = await this.repo.findUsuarioByCorreo(email);

    if (!user || !user.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const roles = user.roles?.map((r) => r.rol.nombre) ?? [];

    const token = await this.jwt.signAsync({
      sub: user.idUsuario.toString(),
      correo: user.persona.correo,
      roles,
    });

    return { token, roles };
  }

  // =========================
  // FORGOT PASSWORD (Etapa 0.5)
  // =========================

  /**
   * Genera token 1-uso para reset password.
   * - Guardamos solo HASH en BD, nunca el token plano.
   * - Respuesta debe ser genérica para no revelar si el correo existe.
   * - En esta etapa devolvemos tokenPlano para probar en Postman.
   */
  async forgotPassword(correo: string) {
  const normalized = (correo ?? '').trim().toLowerCase();
  const user = await this.repo.findUsuarioByCorreo(normalized);

  // Respuesta genérica (evita enumeración)
  const generic = {
    ok: true,
    message: 'Si el correo existe, se enviarán instrucciones para recuperar la contraseña.',
  };

  // Si no existe usuario o está inactivo, devolvemos genérico
  if (!user || !user.activo) return generic;

  const ttlMin = Number(this.config.get('PASSWORD_RESET_TTL_MINUTES') ?? 30);
  const expiresAt = new Date(Date.now() + ttlMin * 60_000);

  // ✅ Token plano + hash (solo el hash se guarda)
  const tokenPlain = generateResetToken();
  const tokenHash = hashToken(tokenPlain);

  // ✅ Invalida tokens anteriores no usados (recomendado)
  await this.prisma.userToken.updateMany({
    where: {
      usuarioId: user.idUsuario,
      type: UserTokenType.PASSWORD_RESET,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  await this.prisma.userToken.create({
    data: {
      usuarioId: user.idUsuario,
      type: UserTokenType.PASSWORD_RESET,
      tokenHash,
      expiresAt,
    },
  });

  // DEV: devolver token solo si env lo permite
  const returnToken =
    String(this.config.get('RETURN_RESET_TOKEN_IN_RESPONSE') ?? 'false').toLowerCase() === 'true';

  if (returnToken) {
    return { ...generic, token_dev_only: tokenPlain, expiresAt };
  }

  // PROD: aquí luego envías correo
  return generic;
}


  /**
   * Consume token 1-uso y cambia contraseña.
   */
  async resetPassword(token: string, password: string) {
  if (!token || token.trim().length < 10) {
    throw new BadRequestException('Token inválido');
  }
  if (!password || password.length < 8) {
    throw new BadRequestException('Password muy corta (mínimo 8)');
  }

  const tokenHash = hashToken(token.trim());
  const now = new Date();

  const record = await this.prisma.userToken.findFirst({
    where: {
      type: UserTokenType.PASSWORD_RESET,
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
  });

  if (!record) {
    throw new BadRequestException('Token inválido o expirado');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await this.prisma.$transaction(async (tx) => {
    await tx.usuario.update({
      where: { idUsuario: record.usuarioId },
      data: { passwordHash },
    });

    await tx.userToken.update({
      where: { idUserToken: record.idUserToken },
      data: { usedAt: now },
    });
  });

  return { ok: true, message: 'Contraseña actualizada' };
}


  
}
