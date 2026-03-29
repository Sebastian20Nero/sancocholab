# SancochoLab - Guia del equipo

Este repositorio tiene:
- `backend/`: API NestJS + Prisma
- `frontend/`: app Angular
- PostgreSQL en Docker

## Objetivo de esta guia

Dar un flujo simple para personas con poca experiencia en Docker/Node:
1. Correr el proyecto.
2. Actualizarlo sin romper entorno.
3. Resolver fallas comunes.
4. Desplegar en Ubuntu.

## Arquitectura (resumen)

- El archivo principal de orquestacion es `docker-compose.yml` (raiz).
- Servicios base:
  - `db`: PostgreSQL (`postgres:16-alpine`)
  - `api`: backend NestJS
- Servicio opcional:
  - `pgadmin` (solo cuando se activa perfil `tools`)

### Por que `localhost:5050` a veces no abre

- `5050` corresponde a pgAdmin (interfaz web opcional).
- PostgreSQL real escucha en `5432`.
- Si no levantas pgAdmin, `5050` queda apagado y eso es normal.

## Inicio rapido (3 comandos)

1) Crear entorno:

```powershell
Copy-Item .env.example .env
```

2) Levantar backend + db + frontend:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1
```

3) Verificar:
- Frontend: `http://localhost:4200`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

Credenciales por defecto (si usas `.env.example` tal cual):
- Correo: `johanstian20@hotmail.com`
- Contrasena: `rmmr`

## Scripts principales

- `scripts/start-backend.ps1`  
  Levanta `db + api` (y pgAdmin opcional).
  - `-SeedOnce`: ejecuta seed en este arranque y luego deja `PRISMA_RUN_SEED=false`.

- `scripts/start-all.ps1`  
  Levanta `db + api` y abre frontend en otra terminal.
  - `-SeedOnce`: igual comportamiento de seed solo por una ejecucion.

- `scripts/reset-local.ps1`  
  Reinicio de entorno local con opcion segura o hard reset.

- `scripts/stop-all.ps1`  
  Apaga stack Docker facilmente.

- `scripts/backup-db.ps1`  
  Genera un dump SQL para compartir datos con el equipo.

- `scripts/restore-db.ps1`  
  Restaura un dump SQL en la BD local (sobrescribe datos existentes).

## Instructivos detallados

- Correr local: `documentacion/01-correr-local.md`
- Actualizacion: `documentacion/02-actualizacion.md`
- Contingencias: `documentacion/03-contingencias.md`
- Despliegue Ubuntu: `documentacion/04-despliegue-ubuntu.md`

## Nota importante de datos

Los datos de PostgreSQL se guardan en volumen Docker (`postgres_data`), no en la imagen.
Por eso:
- `docker compose down` NO borra datos.
- `docker compose down -v` SI borra datos (solo usar en desarrollo cuando sea necesario).

## Compartir datos con companeros

Si cargas datos en tu equipo, los demas no los ven automaticamente porque cada PC usa su propio volumen local.
Para compartir datos reales:

1) Generar backup en tu equipo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\backup-db.ps1
```

2) Enviar el `.sql` generado (carpeta `backups/`) al companero.

3) Restaurar en el equipo del companero:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\restore-db.ps1 -InputFile .\backups\NOMBRE_BACKUP.sql
```

## Nota de seguridad

Las credenciales por defecto son solo para entornos locales de desarrollo.
En servidores reales deben cambiarse inmediatamente.
# SancochoLab

Monorepo con:
- `backend/`: NestJS + Prisma + PostgreSQL
- `frontend/`: Angular

La orquestación Docker unificada vive en `docker-compose.yml` (raíz).

## Inicio rápido (equipo)

1) Crear `.env` desde plantilla:

```powershell
Copy-Item .env.example .env
```

2) Levantar backend + base de datos (un comando):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

2.1) Levantar backend + base de datos + frontend (un comando):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1
```

Esto abre el frontend en una nueva terminal.

3) Levantar frontend (local):

```powershell
cd frontend
npm install
npm run start
```

Accesos:
- Frontend: `http://localhost:4200`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

Opcional (si necesitan UI de DB):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -WithPgAdmin
```

pgAdmin: `http://localhost:5050`

## ¿Por qué a veces falla localhost:5050?

`5050` es **pgAdmin**, no PostgreSQL.
- PostgreSQL corre en `localhost:5432`.
- pgAdmin es opcional y solo levanta con perfil `tools` (`-WithPgAdmin`).

Si solo levantas `db + api`, `5050` estará apagado (normal).

## Instructivos para el equipo

- Correr local: `documentacion/01-correr-local.md`
- Actualizar proyecto: `documentacion/02-actualizacion.md`
- Contingencias: `documentacion/03-contingencias.md`
- Despliegue Ubuntu: `documentacion/04-despliegue-ubuntu.md`

## Scripts operativos

- Arranque backend + DB: `scripts/start-backend.ps1`
- Arranque backend + DB + frontend: `scripts/start-all.ps1`
  - `-WithPgAdmin`: incluye pgAdmin
  - `-ReinstallFrontendDeps`: fuerza `npm install` en frontend
  - `-NoFrontend`: solo backend + db (sin abrir Angular)
- Reset de stack local: `scripts/reset-local.ps1`
  - normal: reinicia contenedores sin borrar datos
  - `-HardReset`: borra volúmenes (pierde datos locales de PostgreSQL)

## Notas de arquitectura

- Servicio `db` usa imagen oficial `postgres:16-alpine`.
- Datos persistidos en volumen Docker `postgres_data`.
- Servicio `api` ejecuta al arrancar:
  - `prisma generate`
  - `prisma migrate deploy`
  - `prisma db seed` solo si `PRISMA_RUN_SEED=true`
# SancochoLab - Guía de ejecución local y despliegue base

Este repositorio usa:
- `frontend/`: Angular
- `backend/`: NestJS + Prisma
- PostgreSQL como base de datos

La arquitectura Docker unificada quedó en **un solo archivo**: `docker-compose.yml` en la raíz.

## 1) Requisitos previos

- Docker Desktop (o Docker Engine + Compose Plugin)
- Node.js 20 LTS
- npm 10+
- Git

Verifica rápido:

```bash
docker --version
docker compose version
node -v
npm -v
```

## 2) Configuración inicial del proyecto

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPO>
cd sancocholab
```

2. Crea el archivo de entorno global:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Ajusta variables sensibles en `.env`:
- `JWT_SECRET`
- `BOOTSTRAP_SECRET`
- (opcional) credenciales admin para seed inicial

## 3) Levantar PostgreSQL + Backend con Docker

Comando único:

```bash
docker compose up --build -d
```

Ver estado:

```bash
docker compose ps
docker compose logs -f db
docker compose logs -f api
```

Servicios esperados:
- API NestJS: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- PostgreSQL: `localhost:5432`

### ¿Qué hace el contenedor del backend al iniciar?

El entrypoint ejecuta automáticamente:
1. `npx prisma generate`
2. `npx prisma migrate deploy`
3. `npx prisma db seed` **solo si** `PRISMA_RUN_SEED=true`
4. Inicia NestJS (`node dist/main.js`)

## 4) Levantar Frontend Angular en local (desarrollo)

El frontend se corre fuera de Docker para desarrollo:

```bash
cd frontend
npm install
npm run start
```

Frontend:
- `http://localhost:4200`

Si el backend está en Docker con puerto `3000`, el frontend puede consumir `http://localhost:3000`.

## 5) Flujo recomendado para desarrolladores nuevos

1. `cp .env.example .env`
2. `docker compose up --build -d`
3. `cd frontend && npm install && npm run start`
4. Validar:
   - Swagger en `http://localhost:3000/docs`
   - Frontend en `http://localhost:4200`

## 6) Problemas comunes y soluciones

### 6.1 Puerto 5432 o 3000 ocupado

Identifica proceso/contenedor en conflicto y libera puerto, o cambia en `.env`:
- `DB_PORT=5433`
- `API_PORT=3001`

Luego:

```bash
docker compose down
docker compose up -d
```

### 6.2 Quiero resetear base de datos (borrar todo)

```bash
docker compose down -v
docker compose up --build -d
```

Esto elimina volúmenes de PostgreSQL y recrea todo.

### 6.3 Migraciones Prisma fallan al iniciar API

Revisa logs:

```bash
docker compose logs -f api
```

Causas comunes:
- credenciales de DB incorrectas en `.env`
- volumen antiguo incompatible
- migraciones pendientes corruptas

Acción rápida de recuperación en local:

```bash
docker compose down -v
docker compose up --build -d
```

### 6.4 Frontend falla por dependencias faltantes

Si Angular reporta paquetes faltantes (ej. `swiper`, `@amcharts/...`), instala lo que el proyecto requiera:

```bash
cd frontend
npm install
```

Si persiste, revisar imports y `package.json`.

## 7) Comandos útiles de operación

Subir stack:

```bash
docker compose up --build -d
```

Detener stack:

```bash
docker compose down
```

Ver logs API:

```bash
docker compose logs -f api
```

Entrar al contenedor API:

```bash
docker compose exec api sh
```

Ejecutar comando Prisma manual:

```bash
docker compose exec api npx prisma migrate status
```

## 8) Despliegue base en Ubuntu (servidor)

1. Instalar Docker + Compose plugin.
2. Clonar repo en servidor.
3. Crear `.env` desde `.env.example` y poner secretos reales.
4. Ejecutar:

```bash
docker compose up --build -d
```

5. Abrir firewall para:
- `API_PORT` (default 3000) solo si expondrás API pública
- `DB_PORT` preferiblemente **no público** (ideal interno/VPN)

Recomendaciones:
- usar reverse proxy (Nginx/Traefik) para HTTPS
- no exponer PostgreSQL públicamente
- usar secretos fuertes y rotación de credenciales

## 9) Archivos legacy que causaban confusión

Para evitar configuraciones dispersas, esta guía asume como **fuente única**:
- `docker-compose.yml` (raíz)
- `backend/Dockerfile`
- `.env` (raíz)

Los archivos viejos de compose/dev en raíz o backend deben eliminarse o no usarse.

# LEVANTAR DOCKER Y ACCESOS
docker-compose -f docker-compose.dev.yml up

Frontend: http://localhost:4200
Swagger API Docs: http://localhost:3000/docs ← AQUÍ verás Swagger funcionando
API Backend: http://localhost:3000
pgAdmin: http://localhost:5050
Email: johanstian20@hotmail.com
Password: rmmr
  PAra acceder al schema:sancocholab

# SancochoLab Backend (Plantilla Base)

Backend en **NestJS + Prisma + PostgreSQL** con una **Etapa 0** lista para reutiluir en otros proyectos: autenticación JWT, roles, permisos finos por catálogo con overrides por usuario, endpoints de administración y bootstrap para DEV/QA.

> Este repositorio es **backend-first**: no incluye front.  
> La API sirve para **web** y también para **móvil** (cuando exista cliente).

---

## Tabla de contenido
- [Características](#características)
- [Stack](#stack)
- [Requisitos](#requisitos)
- [Instalación desde cero](#instalación-desde-cero)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos y Prisma](#base-de-datos-y-prisma)
- [Seed](#seed)
- [Ejecución](#ejecución)
- [Endpoints (Etapa 0)](#endpoints-etapa-0)
- [Flujo de seguridad](#flujo-de-seguridad)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Permisos por catálogo](#permisos-por-catálogo)
- [Cómo agregar un módulo nuevo (Etapas)](#cómo-agregar-un-módulo-nuevo-etapas)
- [Checklist Dev Nuevo](#checklist-dev-nuevo)
- [Colección Postman (estructura)](#colección-postman-estructura)
- [Otras etapas (Backlog de producto)](#otras-etapas-backlog-de-producto)
- [Prompt de rescate (para otra IA)](#prompt-de-rescate-para-otra-ia)

---

## Características
- ✅ Registro público: crea `Persona + Usuario` y asigna rol **OPERADOR** por defecto
- ✅ Login JWT
- ✅ Perfil del usuario por token (`/users/me`)
- ✅ Roles (ADMIN/OPERADOR)
- ✅ Permisos finos por catálogo + overrides por usuario (delegación granular Juan/Ana)
- ✅ Admin real (JWT + rol ADMIN): gestionar usuarios/roles/permisos
- ✅ Bootstrap DEV/QA: endpoint para crear el **primer admin**
- ✅ Prisma migrations + seed

---

## Stack
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (Passport)

---

## Requisitos
- Node.js (LTS recomendado)
- PostgreSQL (local o Docker)
- Git
- Opcional: DBeaver/pgAdmin

---

## Instalación desde cero

### 1) Clonar e instalar
1. `git clone <repo>`
2. `cd backend`
3. `npm install`

### 2) Crear `.env`
Crea `/backend/.env` (ver sección variables).

### 3) Prisma: migraciones + generate
1. `npx prisma generate`
2. `npx prisma migrate dev`

> En ambiente dev, si hay drift o pruebas previas y no importa perder datos:  
`npx prisma migrate reset`

### 4) Seed (roles/permisos base)
`npx prisma db seed`

### 5) Ejecutar
`npm run start:dev`

API: `http://localhost:3000`

---

## Variables de entorno
Archivo `.env`:

- `DATABASE_URL="postgresql://USER:PASS@localhost:5432/SancochoLab?schema=public"`
- `JWT_SECRET="secreto_largo_para_firmar_jwt"`
- `BOOTSTRAP_SECRET="secreto_para_bootstrap_dev_qa"`

**Regla:** nunca subir `.env` al repo. Mantener `.env.example`.

---

## Base de datos y Prisma
- Esquema: `prisma/schema.prisma`
- Migraciones: `prisma/migrations/`

Comandos útiles:
- `npx prisma studio`
- `npx prisma migrate dev --name <migracion>`
- `npx prisma migrate reset` (dev)
- `npx prisma generate`

---

## Seed
El seed inicial:
- crea roles base (`ADMIN`, `OPERADOR`)
- crea permisos catálogo
- deja el sistema listo para asignaciones desde Admin real

Ejecutar:
- `npx prisma db seed`

---

## Endpoints (Etapa 0)

### Público
- `POST /auth/register`  
  Crea usuario y asigna rol **OPERADOR** por defecto.
- `POST /auth/login`  
  Retorna token JWT.
- `GET /users/me` (Bearer token)  
  Valida token y retorna info del usuario.

### Bootstrap (solo DEV/QA)
- `POST /admin/bootstrap`  
  Header: `x-bootstrap-secret: <BOOTSTRAP_SECRET>`  
  Crea el primer admin (solo para arranque rápido en dev/qa).

### Admin real (JWT + rol ADMIN)
- `GET /admin/users`  
  Lista usuarios con roles y permisos.
- `PUT /admin/users/:id/roles`  
  Reemplaza roles del usuario.
- `GET /admin/permisos`  
  Lista catálogo de permisos.
- `PUT /admin/users/:id/permisos`  
  Aplica overrides por usuario (enabled true/false).
- `GET /admin/users/:id`  
  Usuario por id.
- `GET /admin/users/by-email?correo=...`  
  Usuario por correo.

---

## Flujo de seguridad
1) Cliente llama endpoint con `Authorization: Bearer <token>`  
2) `JwtAuthGuard` valida token  
3) Para admin: se valida rol `ADMIN`  
4) Para negocio: se valida permiso requerido (PermissionGuard) cuando existan módulos de negocio

---

## Arquitectura del proyecto

### Estructura recomendada
- `src/auth/` → auth, jwt, guards, strategies
- `src/users/` → usuario/persona, perfil, repositorio
- `src/admin/` → administración: roles, permisos, usuarios
- `src/prisma/` → PrismaService global
- `src/common/` → utilidades compartidas
- (futuro) `src/providers/`, `src/products/`, `src/quotes/`, `src/recipes/`, `src/invoices/`

### Patrón por módulo
- `controller` → entrada HTTP
- `service` → reglas de negocio
- `repository` → acceso a BD (Prisma)
- `dto` → validación de entradas/salidas

---

## Permisos por catálogo
Los permisos no se crean por CRUD. Se definen como **catálogo** (seed) con keys como:
- `QUOTE_CREATE`
- `PROVIDER_CREATE`
- `INVOICE_CONFIRM`
- etc.

Asignación:
- Por rol: `RolPermiso`
- Por usuario: `UsuarioPermiso.enabled` (override)

---

## Cómo agregar un módulo nuevo (Etapas)
Ejemplo para “Cotización”:
1) Crear módulo `src/quotes/`
2) Definir entidades en `schema.prisma`
3) Migración: `npx prisma migrate dev --name quotes_init`
4) Crear:
   - `quotes.controller.ts`
   - `quotes.service.ts`
   - `quotes.repository.ts`
   - `dto/`
5) Definir permisos catálogo requeridos (seed)
6) Proteger endpoints con JWT + PermissionGuard + `@RequirePerm(...)`
7) Probar con Postman

---

## Checklist Dev Nuevo
- Instalar Node LTS, Postgres (o Docker), Git
- Clonar repo y `npm install`
- Copiar `.env.example` → `.env`, ajustar valores
- `npx prisma generate`
- `npx prisma migrate dev`
- `npx prisma db seed`
- `npm run start:dev`
- Probar endpoints en Postman: register/login/me/bootstrap/admin/users

---

## Colección Postman (estructura)
Variables de colección:
- `baseUrl` = `http://localhost:3000`
- `token` = token de login
- `bootstrapSecret` = `BOOTSTRAP_SECRET` del `.env`

Folders sugeridos:
- `00 - Auth (Publico)` → register, login
- `01 - Users (JWT)` → me
- `02 - Admin Bootstrap (DEV/QA)` → bootstrap
- `03 - Admin (JWT + ADMIN)` → users, roles, permisos, by-id, by-email

---

## Otras etapas (Backlog de producto)

> Nota: el desarrollo de estas etapas es **backend**.  
> Para **web** o **móvil**, lo que cambia es el cliente (front), no la API.

### Etapa 1 — Cotización (Proveedores + Productos + Precios)
Objetivo:
- Operador/Admin registran proveedores y productos (sin borrar historial, solo activar/inactivar)
- Registrar precios cotizados por proveedor y producto con fecha, cantidad y unidad de medida
- Consultas “más recientes” por producto o proveedor

Entrega típica:
- Nuevas tablas Prisma: `Proveedor`, `Producto`, `Cotizacion`, `UnidadMedida` (o equivalente)
- Endpoints CRUD mínimos + filtros
- Permisos: `PROVIDER_CREATE`, `PRODUCT_CREATE`, `QUOTE_CREATE`, `QUOTE_READ`, etc.
- Auditoría por entidad: createdBy / updatedBy (usuarioId)

### Etapa 2 — Calculadora (Recetas con elementos cotizados)
Objetivo:
- Crear receta (plato) con múltiples filas/porciones de ingredientes
- Selección por proveedor (por defecto el más barato reciente)
- Permitir valores hipotéticos si no se filtra proveedor
- Calcular costo por porción y totales

Entrega típica:
- Tablas: `Receta`, `RecetaItem` (porciones), `CategoriaReceta` (opcional)
- Endpoints para crear/editar receta y sus items
- Permisos: `RECIPE_CREATE`, `RECIPE_UPDATE`, `RECIPE_READ`

### Etapa 3 — Facturación e Inventario (compras reales)
Objetivo:
- Registrar facturas (fecha, proveedor, imagen/adjunto, usuario creador)
- Registrar detalle factura (items repetidos permitidos)
- Confirmar compra → incrementa inventario (sin stock negativo)
- Cancelar factura con motivo → reverso automático de inventario
- Registrar quién creó / confirmó / canceló

Entrega típica:
- Tablas: `Factura`, `FacturaDetalle`, `Inventario`, `Bodega` (si aplica)
- Endpoints: create invoice, confirm, cancel, list, details
- Permisos: `INVOICE_CREATE`, `INVOICE_CONFIRM`, `INVOICE_CANCEL`, `INVENTORY_READ`, etc.

### Etapa 4 — Olla / Menú (consolidado por receta y fecha)
Objetivo:
- Seleccionar categoría (ej: sopa) + receta única
- Editar “porciones usadas”
- Calcular total por fila y total general
- Guardar OLLA con fecha e imágenes relacionadas

Entrega típica:
- Tablas: `Olla`, `OllaItem` (derivado de receta), `Menu` (opcional)
- Permisos: `POT_CREATE`, `POT_READ`, etc.

### Etapa 5 — Usuarios avanzado (opcional)
- Inactivar/reactivar usuarios
- Refresh tokens / logout por dispositivo (ideal para móvil)
- Auditoría avanzada, rate limiting, hardening

### Tarea pendiente (otra etapa)
- Recuperación de contraseña por correo (envío real)

---

## Prompt de rescate (para otra IA)
Copia y pega este prompt si necesitas que otra IA retome el proyecto:

> Eres un asistente experto en NestJS + Prisma + PostgreSQL. Estoy construyendo un backend llamado SancochoLab como plantilla base reutilizable. Ya existe Etapa 0 con: POST /auth/register (crea Persona+Usuario y asigna rol OPERADOR por defecto), POST /auth/login (JWT), GET /users/me (JWT), POST /admin/bootstrap (solo DEV/QA con header x-bootstrap-secret para crear primer ADMIN si no existe), y Admin real con JWT+rol ADMIN: GET /admin/users, PUT /admin/users/:id/roles, GET /admin/permisos, PUT /admin/users/:id/permisos (overrides enabled true/false), GET /admin/users/:id, GET /admin/users/by-email?correo=. En BD hay tablas: Persona, Usuario, Rol, UsuarioRol, Permiso, RolPermiso, UsuarioPermiso, RefreshToken (opcional), UserToken (opcional). Necesito que me ayudes a documentar instalación, arquitectura, reglas de negocio, y a planear Etapa 1 (Cotización/Recetas/Facturación) definiendo esquema Prisma y endpoints protegidos con PermissionGuard + @RequirePerm. No implementaremos front aún.
