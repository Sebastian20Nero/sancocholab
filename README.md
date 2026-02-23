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
