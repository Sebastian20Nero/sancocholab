# Scripts operativos (guia para el equipo)

Este documento explica como ejecutar los scripts de `scripts/` en Windows PowerShell.
La idea es que cualquier companero pueda levantar, detener y recuperar el entorno local sin conocer Docker a profundidad.

## 0) Regla base (importante)

- Abre PowerShell en la **raiz del proyecto** (donde esta `docker-compose.yml`).
- Si es la primera vez, crea `.env`:

```powershell
# Copia la plantilla de variables de entorno
Copy-Item .env.example .env
```

- Para ejecutar scripts locales usamos `-ExecutionPolicy Bypass`:

```powershell
# Plantilla general para correr cualquier script
powershell -ExecutionPolicy Bypass -File .\scripts\nombre-script.ps1
```

## 1) Levantar backend + DB

Script: `scripts/start-backend.ps1`

Cuando usarlo:
- Quieres API + PostgreSQL para trabajar backend o frontend.
- Es el flujo recomendado diario.

Comando basico:

```powershell
# Levanta db + api (sin pgAdmin)
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

Con pgAdmin:

```powershell
# Levanta db + api + pgAdmin (perfil tools)
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -WithPgAdmin
```

Primer arranque con seed de admin:

```powershell
# Activa seed solo en este arranque y luego lo devuelve a false
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -SeedOnce
```

Ver logs en vivo:

```powershell
# Muestra logs continuos de db y api
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -FollowLogs
```

## 2) Levantar todo (backend + db + frontend)

Script: `scripts/start-all.ps1`

Cuando usarlo:
- Quieres entorno completo para trabajo funcional.
- Abre frontend en otra terminal automaticamente.

Comando basico:

```powershell
# Levanta backend/db y luego abre frontend
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1
```

Con pgAdmin + seed inicial:

```powershell
# Entorno completo con pgAdmin y seed unico
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1 -WithPgAdmin -SeedOnce
```

Reinstalar dependencias frontend (si falla Angular por paquetes):

```powershell
# Fuerza npm install en frontend antes de arrancar
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1 -ReinstallFrontendDeps
```

## 3) Apagar servicios

Script: `scripts/stop-all.ps1`

Cuando usarlo:
- Terminaste la jornada.
- Necesitas liberar puertos.

Comando basico:

```powershell
# Apaga contenedores (conserva datos)
powershell -ExecutionPolicy Bypass -File .\scripts\stop-all.ps1
```

Apagar y limpiar volumenes (borra datos locales de DB):

```powershell
# OJO: esto elimina datos persistidos de postgres en local
powershell -ExecutionPolicy Bypass -File .\scripts\stop-all.ps1 -WithVolumes
```

## 4) Reset del entorno local

Script: `scripts/reset-local.ps1`

Cuando usarlo:
- Estado inconsistente despues de cambios.
- Problemas de migraciones o reinicios raros.

Reset suave:

```powershell
# Reinicia stack sin borrar volumenes
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1
```

Reset fuerte:

```powershell
# OJO: borra volumenes y datos de DB local
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1 -HardReset
```

Reset + levantar pgAdmin:

```powershell
# Reinicia y levanta incluyendo pgAdmin
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1 -WithPgAdmin
```

## 5) Recuperar Docker Desktop cuando falla

Script: `scripts/fix-docker.ps1`

Cuando usarlo:
- Docker Desktop no inicia.
- `docker info` falla.
- El daemon se queda congelado.

Diagnostico y recuperacion:

```powershell
# Intenta recuperar Docker (incluye reinicio de WSL si aplica)
powershell -ExecutionPolicy Bypass -File .\scripts\fix-docker.ps1
```

Recuperar Docker y luego relanzar stack:

```powershell
# Repara Docker y arranca servicios
powershell -ExecutionPolicy Bypass -File .\scripts\fix-docker.ps1 -RestartStack -WithPgAdmin
```

## 6) Reset de credenciales de pgAdmin

Script: `scripts/reset-pgadmin.ps1`

Cuando usarlo:
- Error de login en pgAdmin aunque `.env` este correcto.
- Credenciales antiguas persistidas en volumen interno.

Comando:

```powershell
# Resetea solo pgAdmin (NO toca datos de Postgres)
powershell -ExecutionPolicy Bypass -File .\scripts\reset-pgadmin.ps1
```

Con logs:

```powershell
# Resetea y deja logs en vivo
powershell -ExecutionPolicy Bypass -File .\scripts\reset-pgadmin.ps1 -FollowLogs
```

Credenciales esperadas luego del reset:
- URL: `http://127.0.0.1:5050/login`
- Email: `admin@sancocholab.com`
- Password: `admin123`

## 7) Verificacion rapida de URLs

Con servicios arriba, validar:
- API: `http://127.0.0.1:3000`
- Swagger: `http://127.0.0.1:3000/docs`
- Frontend: `http://127.0.0.1:4200`
- pgAdmin: `http://127.0.0.1:5050/login`

## 8) Flujo recomendado para companeros nuevos

```powershell
# 1) Preparar variables
Copy-Item .env.example .env

# 2) Levantar backend/db/pgAdmin
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -WithPgAdmin

# 3) En otra terminal, levantar frontend
Set-Location .\frontend
npm install
npm run start
```

Si algo falla en Docker:

```powershell
# Recuperacion automatica de Docker + relanzar stack
Set-Location ..
powershell -ExecutionPolicy Bypass -File .\scripts\fix-docker.ps1 -RestartStack -WithPgAdmin
```
