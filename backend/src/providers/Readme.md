# Módulo Providers (Proveedores) — Etapa 1 (Cotización)

Este módulo gestiona el **catálogo de Proveedores** que se usarán en cotizaciones (quotes).
Incluye operaciones CRUD básicas (sin delete físico) y cambio de estado **activo/inactivo**.

> Stack: NestJS + Prisma + PostgreSQL + JWT (Bearer Token)

4) Endpoints del módulo

Base URL (local): http://localhost:3000

4.1 Crear proveedor (REGISTRA)

POST /providers

Auth: Bearer Token (JWT)

Body (raw → JSON):

{
  "nit": "900123456",
  "nombre": "Proveedor Prueba",
  "telefono": "3001234567",
  "correo": "proveedor@correo.com",
  "direccion": "Bogotá"
}


Lógica:

Valida DTO (nit y nombre obligatorios)

Verifica que el NIT no exista

Guarda con createdById = req.user.userId

4.2 Listar proveedores (con filtros + búsqueda + paginación)

GET /providers

Query params disponibles (todas opcionales)
Param	Tipo	Ejemplo	Qué hace
activo	true/false	activo=true	Filtra activos/inactivos
q	string	q=900 / q=prueba	Busca por nit o nombre (contains, insensible a mayúsculas)
page	number	page=1	Página (default 1)
limit	number	limit=20	Tamaño por página (default 20)
Ejemplos de URL

Listado básico:

/providers

Solo activos:

/providers?activo=true

Buscar por nit/nombre:

/providers?q=prueba

Activos + búsqueda + paginación:

/providers?activo=true&q=900&page=1&limit=20

Respuesta esperada
{
  "meta": { "page": 1, "limit": 20, "total": 1, "pages": 1 },
  "items": [
    {
      "idProveedor": "1",
      "nit": "900123456",
      "nombre": "Proveedor Prueba",
      "telefono": "3001234567",
      "correo": "proveedor@correo.com",
      "direccion": "Bogotá",
      "activo": true,
      "createdById": "7",
      "updatedById": null,
      "createdAt": "2026-01-08T20:39:50.819Z",
      "updatedAt": "2026-01-08T20:39:50.819Z"
    }
  ]
}


Lógica interna del listado:

Construye where dinámico:

Si activo viene, filtra por activo

Si q viene, aplica OR sobre nit y nombre

Usa $transaction para traer count + findMany

Aplica skip/take calculado por page/limit

Ordena por createdAt desc

4.3 Consultar proveedor por id

GET /providers/:id

Ejemplo:

/providers/1

Lógica:

Convierte :id a BigInt (ParseBigIntPipe)

Si no existe → 404

4.4 Actualizar proveedor (edición parcial)

PATCH /providers/:id

Auth: Bearer Token

Body (raw → JSON): puedes enviar 1 o varios campos

Ejemplo:

{
  "nombre": "Proveedor Actualizado",
  "telefono": "3019999999",
  "direccion": "Medellín"
}


Lógica:

Busca que exista el proveedor

Actualiza campos enviados

Guarda updatedById = req.user.userId

Importante: en Postman el body debe ser raw → JSON, no Text.

4.5 Activar / Inactivar proveedor

PATCH /providers/:id/status

Auth: Bearer Token

Body (raw → JSON):

Inactivar:

{ "activo": false }


Activar:

{ "activo": true }


Lógica:

Valida activo boolean

Actualiza activo

Guarda updatedById = req.user.userId

5) Pruebas rápidas en Postman
Crear

POST http://localhost:3000/providers

Listar (activos)

GET http://localhost:3000/providers?activo=true

Listar (buscar + paginar)

GET http://localhost:3000/providers?activo=true&q=prueba&page=1&limit=20

Actualizar

PATCH http://localhost:3000/providers/1

Status

PATCH http://localhost:3000/providers/1/status con { "activo": false }

6) Errores comunes

400: body vacío o Content-Type incorrecto

401: token faltante / inválido

404: proveedor no existe

400 NIT ya existe: intentas crear con nit repetido

7) Seguridad (JWT)

Este módulo usa JwtAuthGuard y obtiene el usuario desde req.user.
En este proyecto el id está en:

req.user.userId (string) → se convierte a BigInt para createdById/updatedById

8) Pendiente (futuro)

Integración con permisos por endpoint:

PROVIDER_CREATE

PROVIDER_READ

PROVIDER_UPDATE

Auditoría más detallada (IP, userAgent, etc.)