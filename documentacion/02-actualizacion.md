# 02 - Actualizacion del proyecto

## Objetivo

Actualizar codigo, imagenes y dependencias con el menor riesgo para el equipo.

## Flujo recomendado (seguro)

Desde raiz del repo:

```bash
git pull
```

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1
```

**Por que este flujo:** reinicia contenedores y recompila para aplicar cambios nuevos sin borrar datos de PostgreSQL.

## Cuando actualizar frontend

Si hubo cambios en `frontend/package.json` o errores de modulos:

```powershell
cd frontend
npm install
npm run build
```

**Por que:** al cambiar dependencias, `node_modules` local debe sincronizarse.

## Actualizacion con limpieza profunda (solo dev)

Usar cuando migraciones o datos locales quedaron inconsistentes:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1 -HardReset
```

**Importante:** `-HardReset` borra volumenes, por lo tanto elimina BD local.

## Checklist post-actualizacion

1. `docker compose ps` muestra `db` y `api` en estado `Up`.
2. `http://localhost:3000/docs` responde.
3. Frontend abre en `http://localhost:4200`.

## Compartir datos actualizados con el equipo

Cuando necesites que todos vean la misma data:

1) Genera dump en tu equipo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\backup-db.ps1
```

2) Comparte el `.sql` (carpeta `backups/`).

3) Cada companero restaura en su local:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\restore-db.ps1 -InputFile .\backups\NOMBRE_BACKUP.sql
```

**Importante:** restore sobrescribe la BD local del companero.
# Instructivo: actualizar proyecto

## Actualización estándar (sin perder datos)

Desde raíz:

```bash
git pull
docker compose pull
docker compose up --build -d
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

## Actualización recomendada con script

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1
```

## Si hubo cambios fuertes de BD/migraciones

1. Respaldar datos (si aplica).
2. Ejecutar hard reset solo en ambientes de desarrollo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1 -HardReset
```
