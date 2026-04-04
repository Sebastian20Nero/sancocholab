# Despliegue en Ubuntu

Esta guia deja el proyecto funcionando en un servidor Ubuntu para que, al actualizar `main`, puedas volver a desplegar y ver los cambios publicados.

## 1) Que arquitectura se usa en servidor

En servidor se usa `deploy/docker-compose.server.yml` y no el compose local.

Servicios:

- `db`: PostgreSQL con volumen persistente.
- `api`: backend NestJS + Prisma.
- `web`: frontend Angular compilado y servido con Nginx.

El frontend de produccion consume la API por `'/api'`, asi que el navegador no depende de `127.0.0.1:3000`.

## 2) Requisitos del servidor

Instala:

- `git`
- `docker`
- `docker compose`

Ejemplo rapido en Ubuntu:

```bash
sudo apt update
sudo apt install -y git docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker "$USER"
```

Luego cierra sesion y vuelve a entrar para aplicar el grupo `docker`.

## 3) Clonar el proyecto

```bash
git clone <URL_DEL_REPO> sancocholab
cd sancocholab
```

## 4) Crear variables de entorno

```bash
cp .env.example .env
```

Ajusta como minimo:

- `JWT_SECRET`
- `BOOTSTRAP_SECRET`
- `POSTGRES_PASSWORD`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `WEB_PORT`

Si no quieres exponer la API publicamente, deja `API_PORT=3000`. El compose la publica solo en `127.0.0.1`.

## 5) Primer despliegue

Da permisos al script:

```bash
chmod +x deploy/update-main.sh
```

Ejecuta:

```bash
./deploy/update-main.sh
```

Esto hara:

1. Cambiar a `main`.
2. Descargar cambios remotos.
3. Reconstruir imagenes.
4. Levantar `db + api + web`.

## 6) Verificar

```bash
docker compose --env-file .env -f deploy/docker-compose.server.yml ps
```

Revisar logs si algo falla:

```bash
docker compose --env-file .env -f deploy/docker-compose.server.yml logs -f
```

Validaciones tipicas:

- Frontend: `http://IP_DEL_SERVIDOR`
- API docs desde el mismo servidor: `http://127.0.0.1:3000/docs`
- Frontend consumiendo API: `http://IP_DEL_SERVIDOR/api`

## 7) Actualizar cuando cambie main

Cada vez que subas cambios a `main`, entra al servidor y ejecuta:

```bash
cd /ruta/a/sancocholab
./deploy/update-main.sh
```

Con eso se hace `git pull --ff-only` y se reconstruyen los contenedores para reflejar backend y frontend.

## 8) Recomendacion para dominio y HTTPS

Si vas a publicar esto fuera de red local, lo recomendable es poner un proxy inverso delante, por ejemplo:

- Nginx en el host
- Caddy
- Nginx Proxy Manager

Asi podras:

- usar dominio propio
- habilitar HTTPS
- redirigir trafico a `web`

## 9) Respaldo de datos

Los datos de PostgreSQL viven en un volumen Docker, asi que no se pierden por hacer `git pull`.

Se perderian si haces un borrado de volumenes, por ejemplo:

```bash
docker compose -f deploy/docker-compose.server.yml down -v
```

Por eso:

- usa backup antes de cambios delicados
- no borres volumenes en actualizaciones normales

## 10) Errores comunes

### El puerto 80 esta ocupado

Cambia `WEB_PORT` en `.env`, por ejemplo:

```bash
WEB_PORT=8080
```

### Docker no deja levantar contenedores

Verifica:

```bash
docker info
```

### El script falla por cambios locales

`git pull --ff-only` fallara si el repo tiene cambios manuales en el servidor. La buena practica es no editar codigo directamente alla.

## 11) Flujo recomendado de trabajo

1. Desarrollar y probar en local.
2. Subir cambios al repositorio.
3. Integrar en `main`.
4. Entrar al servidor.
5. Ejecutar `./deploy/update-main.sh`.
6. Validar frontend y API.
