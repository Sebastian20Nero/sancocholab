import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UnitConversionModule } from '../unit-conversion/unit-conversion.module';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [PrismaModule, AuthModule, UnitConversionModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService], // ✅ clave para que otro módulo lo pueda inyectar
})
export class RecipesModule {}
