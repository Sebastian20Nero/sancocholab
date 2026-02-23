import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  /**
   * TEMP: si quieres que /users siga registrando (mientras migras a /auth/register),
   * usa el mismo DTO y misma lógica.
   */
  @Post()
  create(@Body() dto: RegisterDto) {
    return this.users.registerPublic(dto);
  }

  @Get()
  list() {
    return this.users.list();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.users.me(req.user.userId);
  }
}
