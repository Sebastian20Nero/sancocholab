# Backend

La configuracion operativa del proyecto ya no vive en esta carpeta.

Referencias vigentes:

- guia principal: `../README.md`
- despliegue Ubuntu: `../documentacion/04-despliegue-ubuntu.md`
- scripts operativos Windows: `../documentacion/05-scripts-operativos.md`
- guia rapida local: `../documentacion/06-guia-rapida-local.md`

Regla actual:

- el unico `.env` canonico esta en la raiz del proyecto
- el `docker-compose.yml` canonico para local tambien esta en la raiz
- el despliegue de servidor usa `../deploy/docker-compose.server.yml`
