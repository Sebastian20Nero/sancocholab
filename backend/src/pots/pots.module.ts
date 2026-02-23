import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PotsController } from './pots.controller';
import { PotsService } from './pots.service';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [PrismaModule, RecipesModule], // ✅
  controllers: [PotsController],
  providers: [PotsService],
})
export class PotsModule {}
