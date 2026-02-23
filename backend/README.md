# base de datos
Ruta/URL de pgAdmin: http://localhost:5050
Archivo/compose usado: backend/docker-compose.dev.yml
Servidor a crear en pgAdmin (Register Server):
Host name / Address: db (nombre del servicio en Docker Compose, no localhost)
Port: 5432
Maintenance DB / Database: sancocholab
Username: sancocholab
Password: sancocholab

# Ejecucion Backend
docker compose up -d --build
docker compose ps
cd frontend
npm start

# Correr Base de datos
docker exec -it sancocholab_db psql -U sancocholab -d sancocholab

# Ejecucion actualizacion backend
docker compose -f docker-compose.dev.yml restart api
docker compose up -d --build api


# SancochoLab Backend (NestJS + Prisma + PostgreSQL)

Backend API para SancochoLab, construido con NestJS + Prisma + PostgreSQL.
Incluye Docker Compose para levantar el entorno de desarrollo en Windows.

---

## Tecnologías
- Node.js 20
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL 16
- Docker Desktop + Docker Compose

---

## Requisitos (Windows)
- Git
- Node.js (solo si vas a correr sin docker)
- Docker Desktop (Wsl2 recomendado)
- (Opcional) VSCode

---

## Variables de entorno
Este repo NO sube secretos.

- `.env` → para correr LOCAL (sin docker)
- `.env.docker` → para correr con Docker Compose (dev)
- `.env.example` → plantilla

---

## Levantar en Docker (modo DEV con hot reload)
En la carpeta `backend/`:

```bash
docker compose -f docker-compose.dev.yml down -v --remove-orphans
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml logs -f api

Endpoints:

Health: http://localhost:3000/health

Swagger: http://localhost:3000/docs

Base de datos (Docker)

Postgres corre en:

Host: localhost

Port: 5432

User/Pass/DB: según docker-compose.dev.yml

Dentro del contenedor, el host correcto para Prisma es db:
DATABASE_URL="postgresql://USER:PASS@db:5432/DB?schema=public"

Migraciones y Seed

El compose ejecuta automáticamente:

prisma generate

prisma migrate deploy

prisma db seed

npm run start:dev

Si necesitas ejecutar manualmente:

docker exec -it sancocholab_api sh -lc "npx prisma migrate deploy"
docker exec -it sancocholab_api sh -lc "npx prisma db seed"

Errores comunes
1) Docker no conecta: dockerDesktopLinuxEngine pipe not found

Asegúrate de abrir Docker Desktop

Revisa que estés en modo Linux containers

Reinicia Docker Desktop si persiste

2) Prisma/TypeScript con tipos desactualizados

En VSCode:

TypeScript: Restart TS Server

Developer: Reload Window

3) Hot reload lento / no detecta cambios (Windows)

Ya está configurado:

CHOKIDAR_USEPOLLING=true

WATCHPACK_POLLING=true

Convenciones del proyecto

Módulos Nest por dominio: users, auth, providers, products, etc.

PrismaModule centraliza PrismaClient

ConfigModule global para variables de entorno

Endpoints documentados en Swagger /docs