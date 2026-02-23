import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// ✅ Permite que JSON serialice BigInt (Prisma + Postgres)
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  console.log('CWD:', process.cwd());
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);

  const app = await NestFactory.create(AppModule);

  // ✅ CORS configurado para front, swagger y postman
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'http://localhost:3000',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });



  // ✅ Validación automática de DTOs
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


  // ✅ Swagger (ANTES del listen)
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

  await app.listen(3000);
  console.log(`✅ API running on http://localhost:3000`);
  console.log(`📘 Swagger on http://localhost:3000/docs`);
}
bootstrap();
