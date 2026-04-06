# SancochoLab

Proyecto con `frontend` en Angular y `backend` en NestJS + Prisma + PostgreSQL.

La estructura recomendada queda asi:

- `docker-compose.yml`: stack local canonico (`db + api`, con `pgAdmin` opcional).
- `.env.example`: unica plantilla de variables compartida por el proyecto.
- `scripts/`: scripts operativos para Windows PowerShell.
- `deploy/`: archivos dedicados a despliegue en Ubuntu.
- `documentacion/`: guias detalladas para equipo y despliegue.

## Flujo recomendado en local

### 1. Preparar variables

```powershell
Copy-Item .env.example .env
```

### 2. Levantar backend + base de datos

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

Con `pgAdmin`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -WithPgAdmin
```

### 3. Levantar frontend

```powershell
Set-Location .\frontend
npm install
npm run start
```

## URLs locales

- Frontend: `http://127.0.0.1:4200`
- API: `http://127.0.0.1:3000`
- Swagger: `http://127.0.0.1:3000/docs`
- pgAdmin: `http://127.0.0.1:5050/login`

## Credenciales por defecto

- App:
  - correo: `johanstian20@hotmail.com`
  - password: `rmmr`
- pgAdmin:
  - email: `admin@sancocholab.com`
  - password: `admin123`

## Scripts operativos

- `scripts/start-backend.ps1`: levanta `db + api`.
- `scripts/start-all.ps1`: levanta backend/db y abre frontend en otra terminal.
- `scripts/stop-all.ps1`: apaga el stack.
- `scripts/reset-local.ps1`: reinicia el entorno local.
- `scripts/fix-docker.ps1`: intenta recuperar Docker Desktop cuando falla.
- `scripts/reset-pgadmin.ps1`: resetea credenciales de `pgAdmin`.

Documentacion ampliada:

- `documentacion/05-scripts-operativos.md`
- `documentacion/06-guia-rapida-local.md`

## Arquitectura Docker que queda

### Local

Se usa solo `docker-compose.yml` en la raiz:

- `db`: PostgreSQL persistente.
- `api`: NestJS compilado dentro del contenedor, con `Prisma generate`, `migrate deploy` y seed opcional.
- `pgAdmin`: perfil opcional `tools`.

El frontend se ejecuta fuera de Docker en local para desarrollo mas simple.

Variables relevantes para local:

- `CORS_ORIGINS`: por defecto permite `localhost` y `127.0.0.1` para frontend, Swagger y pruebas locales.
- `SWAGGER_ENABLED=true`: mantiene `http://127.0.0.1:3000/docs` activo en desarrollo.

### Servidor Ubuntu

Se usa `deploy/docker-compose.server.yml`:

- `db`: PostgreSQL persistente.
- `api`: backend NestJS.
- `web`: frontend Angular compilado y servido con Nginx.

El frontend de produccion usa `environment.prod.ts` con `apiBaseUrl: '/api'`, y Nginx redirige `/api` al backend.

Variables recomendadas para servidor:

- `CORS_ORIGINS=https://tu-dominio.com,http://IP_DEL_SERVIDOR`
- `SWAGGER_ENABLED=false`

## Despliegue en Ubuntu

Resumen rapido:

1. Clonar el repo en el servidor.
2. Crear `.env` desde `.env.example`.
3. Dar permisos al script:

```bash
chmod +x deploy/update-main.sh
```

4. Ejecutar despliegue/actualizacion:

```bash
./deploy/update-main.sh
```

Ese script hace:

- `git fetch origin main`
- `git checkout main`
- `git pull --ff-only origin main`
- `docker compose --env-file .env -f deploy/docker-compose.server.yml up -d --build`

Guia completa:

- `documentacion/04-despliegue-ubuntu.md`

## Limpieza aplicada

La referencia canonica de variables ahora es solo la raiz:

- se conserva `.env.example`
- el `.env` de la raiz sigue siendo local y no se sube a Git
- los archivos Docker y `.env` heredados de `backend/` deben desaparecer del flujo normal

## Notas importantes

- Si el frontend no resuelve `localhost` en tu equipo, usa siempre `127.0.0.1`.
- Para compartir datos entre companeros, usa los scripts de backup/restore y no intentes subir volumenes Docker al repo.
- Si en `main` cambias frontend o backend, el servidor reflejara esos cambios tras correr `./deploy/update-main.sh`.
