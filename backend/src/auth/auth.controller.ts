import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UsersService,
  ) {}

  /**
   * Registro público
   */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.users.registerPublic(dto);
  }

  /**
   * Login (correo + password)
   */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.correo, dto.password);
  }

  /**
   * POST /auth/forgot-password
   * Etapa 0.5: devuelve token_dev_only para probar en Postman.
   */
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.correo);
  }

  /**
   * POST /auth/reset-password
   * Usa token 1-uso y cambia la contraseña.
   */
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.password);
  }
}
