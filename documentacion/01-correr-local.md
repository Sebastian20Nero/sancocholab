# 01 - Correr local (paso a paso y explicacion)

## Para que sirve este instructivo

Este documento explica como levantar el proyecto desde cero y por que se hace cada paso.
Pensado para companeros con poca experiencia en Docker o backend/frontend separados.

## Requisitos previos

- Docker Desktop funcionando.
- Node.js 20+.
- npm.
- Git.

Verificacion rapida:

```powershell
docker --version
docker compose version
node -v
npm -v
```

## Paso 1: clonar repositorio

```bash
git clone <URL_REPO>
cd sancocholab
```

**Por que:** necesitas el codigo fuente local para construir contenedores y ejecutar Angular.

## Paso 2: crear archivo `.env`

```powershell
Copy-Item .env.example .env
```

Revisa valores sensibles en `.env`:
- `JWT_SECRET`
- `BOOTSTRAP_SECRET`

**Por que:** el backend necesita variables para seguridad y conexion de servicios.

## Paso 3: levantar backend + base de datos

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

Opcional con pgAdmin:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -WithPgAdmin
```

**Por que:** el backend depende de PostgreSQL; este script evita recordar multiples comandos.

## Paso 4: levantar frontend

```powershell
cd frontend
npm install
npm run start
```

**Por que:** el frontend se corre local para desarrollo rapido (hot reload).

## Verificacion final

- Swagger: `http://localhost:3000/docs`
- API: `http://localhost:3000`
- Frontend: `http://localhost:4200`
- pgAdmin (si se activo): `http://localhost:5050`

Si `5050` no abre y no levantaste `-WithPgAdmin`, es normal.

## Credenciales por defecto para iniciar sesion en la app

Si copiaste `.env.example` sin cambios, el seed crea este usuario:
- Correo: `johanstian20@hotmail.com`
- Contrasena: `rmmr`

**Por que funciona:** `PRISMA_RUN_SEED=true` en `.env.example` ejecuta el seed al iniciar backend.

## Modo recomendado para primer arranque (seed una sola vez)

Para crear usuarios/datos base solo en el primer inicio:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1 -SeedOnce
```

Ese modo:
1) pone `PRISMA_RUN_SEED=true` temporalmente,  
2) levanta servicios,  
3) vuelve a dejar `PRISMA_RUN_SEED=false` automaticamente.
