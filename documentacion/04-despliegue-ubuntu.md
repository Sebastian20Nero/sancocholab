# 04 - Despliegue en Ubuntu (guia explicada)

## Objetivo

Tener una instalacion repetible en servidor Ubuntu usando Docker Compose.

## 1) Preparar servidor

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
```

**Por que:** el proyecto depende de contenedores (`db` y `api`).

## 2) Descargar proyecto

```bash
git clone <URL_REPO>
cd sancocholab
cp .env.example .env
```

Editar `.env` con valores reales:
- `JWT_SECRET`
- `BOOTSTRAP_SECRET`
- credenciales de DB

**Por que:** no usar secretos de desarrollo en produccion.

## 3) Levantar servicios

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f api
```

**Por que:** `--build` asegura imagen API actualizada con el ultimo codigo.

## 4) Buenas practicas minimas

- No exponer PostgreSQL a internet publica.
- Publicar API detras de Nginx/Traefik con HTTPS.
- Guardar backups periodicos (`pg_dump`).
- Rotar secretos y contrasenas.

## 5) Actualizacion en servidor

```bash
git pull
docker compose up --build -d
```

## 6) Rollback simple

1. Volver a commit/tag estable.
2. Rebuild:

```bash
docker compose up --build -d
```
