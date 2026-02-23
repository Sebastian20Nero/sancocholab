import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from '../auth/roles.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminBootstrapController } from './admin-bootstrap.controller'

@Module({
  imports: [UsersModule], // ✅ acceso a UsersRepository/UsersService exportados
  controllers: [AdminBootstrapController, AdminController],
  providers: [AdminService, RolesGuard], // RolesGuard disponible en este contexto
})
export class AdminModule {}
