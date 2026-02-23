import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { QuotesModule } from './quotes/quotes.module';
import { ProvidersModule } from './providers/providers.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { MeasuresModule } from './measures/measures.module';
import { RecipesModule } from './recipes/recipes.module';
import { RecipeCategoriesModule } from './recipe-categories/recipe-categories.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InvoicesModule } from './invoices/invoices.module';
import { InventoryModule } from './inventory/inventory.module';
import { PotsModule } from './pots/pots.module';

import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminModule,
    QuotesModule,
    ProvidersModule,
    ProductsModule,
    CategoriesModule,
    MeasuresModule,
    RecipesModule,
    RecipeCategoriesModule,
    WarehousesModule,
    InvoicesModule,
    InventoryModule,
    PotsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
