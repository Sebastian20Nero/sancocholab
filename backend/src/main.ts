import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// ✅ Permite que JSON serialice BigInt (Prisma + Postgres)
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function parseCorsOrigins(raw?: string): string[] {
  const fallback = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  if (!raw?.trim()) {
    return fallback;
  }

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  const swaggerEnabled = process.env.SWAGGER_ENABLED !== 'false';

  // Local sigue funcionando por defecto; en servidor se ajusta con CORS_ORIGINS.
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ✅ Errores Prisma bonitos
  app.useGlobalFilters(new PrismaExceptionFilter());

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('SancochoLab API')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'jwt'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`✅ API running on http://0.0.0.0:${port}`);
  if (swaggerEnabled) {
    console.log(`📘 Swagger on http://0.0.0.0:${port}/docs`);
  }
}
bootstrap();
