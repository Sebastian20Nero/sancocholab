import { Module } from '@nestjs/common';
import { RecipeCategoriesController } from './recipe-categories.controller';
import { RecipeCategoriesService } from './recipe-categories.service';
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RecipeCategoriesController],
  providers: [RecipeCategoriesService],
  exports: [RecipeCategoriesService],
})
export class RecipeCategoriesModule {}
