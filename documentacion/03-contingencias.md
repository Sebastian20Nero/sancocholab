# 03 - Contingencias (fallas comunes y por que pasan)

## 1) `localhost:5050` no responde

### Causa
`5050` es pgAdmin (herramienta opcional), no PostgreSQL.

### Solucion

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -WithPgAdmin
```

PostgreSQL siempre va en `localhost:5432`.

## 2) API reinicia en bucle

### Causa comun
- variable faltante en `.env`
- error de migracion Prisma
- contenedor viejo con estado inconsistente

### Diagnostico

```bash
docker compose logs -f api
```

### Solucion rapida

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1
```

## 3) Puerto ocupado (`3000` o `5432`)

### Causa
Otro proceso o contenedor usando ese puerto.

### Solucion
Cambiar en `.env`:
- `API_PORT=3001`
- `DB_PORT=5433`

Luego:

```bash
docker compose down
docker compose up -d
```

## 4) Base de datos inconsistente

### Solucion (solo desarrollo)

Opcional antes del reset: sacar backup rapido.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\backup-db.ps1
```

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-local.ps1 -HardReset
```

### Por que funciona
Elimina volumenes y reconstruye DB + migraciones desde cero.

## 5) Docker Desktop congelado o inestable

```powershell
wsl --shutdown
```

Cerrar y abrir Docker Desktop. Esperar estado "Engine running".

## 6) Apagar todo rapido

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-all.ps1 -RemoveOrphans
```

Con borrado de volumenes (solo dev):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-all.ps1 -RemoveOrphans -WithVolumes
```
