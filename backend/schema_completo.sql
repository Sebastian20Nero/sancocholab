-- ═══════════════════════════════════════════════════════════════════
-- SANCOCHOLAB - SCRIPT COMPLETO DE BASE DE DATOS
-- Generado desde schema.prisma
-- Fecha: 2026-03-13
-- Motor: PostgreSQL 16
-- ═══════════════════════════════════════════════════════════════════

-- ─── ENUMS ───────────────────────────────────────────────────────

CREATE TYPE "UserTokenType" AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFY');
CREATE TYPE "ModoItemReceta" AS ENUM ('AUTO', 'BY_PROVIDER', 'HYPOTHETICAL');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELED');
CREATE TYPE "InventoryMoveType" AS ENUM ('IN', 'OUT', 'ADJUST');
CREATE TYPE "PotStatus" AS ENUM ('OPEN', 'CLOSED');


-- ═══════════════════════════════════════════════════════════════════
-- 1. PERSONA
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Persona" (
    "idPersona"   BIGSERIAL     PRIMARY KEY,
    "nombres"     TEXT          NOT NULL,
    "apellidos"   TEXT          NOT NULL,
    "correo"      TEXT          NOT NULL UNIQUE,
    "celular"     TEXT          NOT NULL,
    "activo"      BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)  NOT NULL
);


-- ═══════════════════════════════════════════════════════════════════
-- 2. USUARIO
-- Relación: Usuario 1:1 Persona (personaId → Persona.idPersona)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Usuario" (
    "idUsuario"    BIGSERIAL     PRIMARY KEY,
    "personaId"    BIGINT        NOT NULL UNIQUE,
    "passwordHash" TEXT          NOT NULL,
    "ultimoLogin"  TIMESTAMP(3),
    "activo"       BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "fk_usuario_persona"
        FOREIGN KEY ("personaId") REFERENCES "Persona"("idPersona")
);


-- ═══════════════════════════════════════════════════════════════════
-- 3. ROL
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Rol" (
    "idRol"       BIGSERIAL     PRIMARY KEY,
    "nombre"      TEXT          NOT NULL UNIQUE,
    "descripcion" TEXT,
    "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)  NOT NULL
);


-- ═══════════════════════════════════════════════════════════════════
-- 4. USUARIO_ROL (Tabla pivote: Usuario ↔ Rol)
-- PK compuesta: (usuarioId, rolId)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "UsuarioRol" (
    "usuarioId" BIGINT NOT NULL,
    "rolId"     BIGINT NOT NULL,

    PRIMARY KEY ("usuarioId", "rolId"),

    CONSTRAINT "fk_usuariorol_usuario"
        FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE CASCADE,
    CONSTRAINT "fk_usuariorol_rol"
        FOREIGN KEY ("rolId") REFERENCES "Rol"("idRol") ON DELETE CASCADE
);
CREATE INDEX "idx_usuariorol_rol" ON "UsuarioRol"("rolId");


-- ═══════════════════════════════════════════════════════════════════
-- 5. PERMISO
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Permiso" (
    "idPermiso"   BIGSERIAL     PRIMARY KEY,
    "key"         TEXT          NOT NULL UNIQUE,
    "descripcion" TEXT,
    "activo"      BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)  NOT NULL
);


-- ═══════════════════════════════════════════════════════════════════
-- 6. ROL_PERMISO (Tabla pivote: Rol ↔ Permiso)
-- PK compuesta: (rolId, permisoId)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "RolPermiso" (
    "rolId"     BIGINT NOT NULL,
    "permisoId" BIGINT NOT NULL,

    PRIMARY KEY ("rolId", "permisoId"),

    CONSTRAINT "fk_rolpermiso_rol"
        FOREIGN KEY ("rolId") REFERENCES "Rol"("idRol") ON DELETE CASCADE,
    CONSTRAINT "fk_rolpermiso_permiso"
        FOREIGN KEY ("permisoId") REFERENCES "Permiso"("idPermiso") ON DELETE CASCADE
);
CREATE INDEX "idx_rolpermiso_permiso" ON "RolPermiso"("permisoId");


-- ═══════════════════════════════════════════════════════════════════
-- 7. USUARIO_PERMISO (Permisos directos por usuario)
-- PK compuesta: (usuarioId, permisoId)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "UsuarioPermiso" (
    "usuarioId" BIGINT  NOT NULL,
    "permisoId" BIGINT  NOT NULL,
    "enabled"   BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("usuarioId", "permisoId"),

    CONSTRAINT "fk_usuariopermiso_usuario"
        FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE CASCADE,
    CONSTRAINT "fk_usuariopermiso_permiso"
        FOREIGN KEY ("permisoId") REFERENCES "Permiso"("idPermiso") ON DELETE CASCADE
);
CREATE INDEX "idx_usuariopermiso_permiso" ON "UsuarioPermiso"("permisoId");


-- ═══════════════════════════════════════════════════════════════════
-- 8. REFRESH_TOKEN
-- Relación: RefreshToken N:1 Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "RefreshToken" (
    "idRefreshToken" BIGSERIAL     PRIMARY KEY,
    "usuarioId"      BIGINT        NOT NULL,
    "tokenHash"      TEXT          NOT NULL,
    "revoked"        BOOLEAN       NOT NULL DEFAULT false,
    "expiresAt"      TIMESTAMP(3)  NOT NULL,
    "createdAt"      TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt"      TIMESTAMP(3),

    CONSTRAINT "fk_refreshtoken_usuario"
        FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE CASCADE
);
CREATE INDEX "idx_refreshtoken_usuario"  ON "RefreshToken"("usuarioId");
CREATE INDEX "idx_refreshtoken_expires"  ON "RefreshToken"("expiresAt");
CREATE INDEX "idx_refreshtoken_revoked"  ON "RefreshToken"("revoked");


-- ═══════════════════════════════════════════════════════════════════
-- 9. USER_TOKEN (Reset password, verificación email)
-- Relación: UserToken N:1 Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "UserToken" (
    "idUserToken" BIGSERIAL       PRIMARY KEY,
    "usuarioId"   BIGINT          NOT NULL,
    "type"        "UserTokenType" NOT NULL,
    "tokenHash"   TEXT            NOT NULL,
    "usedAt"      TIMESTAMP(3),
    "expiresAt"   TIMESTAMP(3)    NOT NULL,
    "createdAt"   TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fk_usertoken_usuario"
        FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE CASCADE
);
CREATE INDEX "idx_usertoken_usuario_type" ON "UserToken"("usuarioId", "type");
CREATE INDEX "idx_usertoken_expires"      ON "UserToken"("expiresAt");


-- ═══════════════════════════════════════════════════════════════════
-- 10. UNIDAD_MEDIDA
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "UnidadMedida" (
    "idUnidadMedida" BIGSERIAL     PRIMARY KEY,
    "key"            TEXT          NOT NULL UNIQUE,
    "nombre"         TEXT          NOT NULL,
    "activo"         BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"      TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)  NOT NULL
);
CREATE INDEX "idx_unidadmedida_activo" ON "UnidadMedida"("activo");
CREATE INDEX "idx_unidadmedida_key"    ON "UnidadMedida"("key");


-- ═══════════════════════════════════════════════════════════════════
-- 11. UNIDAD_CONVERSION (Conversiones entre unidades)
-- Relación: fromUnidadId → UnidadMedida, toUnidadId → UnidadMedida
-- UNIQUE: (fromUnidadId, toUnidadId)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "UnidadConversion" (
    "idUnidadConversion" BIGSERIAL        PRIMARY KEY,
    "fromUnidadId"       BIGINT           NOT NULL,
    "toUnidadId"         BIGINT           NOT NULL,
    "factor"             DECIMAL(18, 10)  NOT NULL,
    "activo"             BOOLEAN          NOT NULL DEFAULT true,
    "createdAt"          TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3)     NOT NULL,

    CONSTRAINT "fk_conversion_from"
        FOREIGN KEY ("fromUnidadId") REFERENCES "UnidadMedida"("idUnidadMedida"),
    CONSTRAINT "fk_conversion_to"
        FOREIGN KEY ("toUnidadId") REFERENCES "UnidadMedida"("idUnidadMedida"),

    CONSTRAINT "uq_unidad_conversion_from_to" UNIQUE ("fromUnidadId", "toUnidadId")
);
CREATE INDEX "idx_unidad_conversion_from"   ON "UnidadConversion"("fromUnidadId");
CREATE INDEX "idx_unidad_conversion_to"     ON "UnidadConversion"("toUnidadId");
CREATE INDEX "idx_unidad_conversion_activo" ON "UnidadConversion"("activo");


-- ═══════════════════════════════════════════════════════════════════
-- 12. CATEGORIA (Categorías de productos/insumos)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Categoria" (
    "idCategoria" BIGSERIAL     PRIMARY KEY,
    "nombre"      TEXT          NOT NULL UNIQUE,
    "activo"      BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)  NOT NULL
);
CREATE INDEX "idx_categoria_activo" ON "Categoria"("activo");
CREATE INDEX "idx_categoria_nombre" ON "Categoria"("nombre");


-- ═══════════════════════════════════════════════════════════════════
-- 13. PROVEEDOR
-- Relación: createdById → Usuario, updatedById → Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Proveedor" (
    "idProveedor"  BIGSERIAL     PRIMARY KEY,
    "nit"          TEXT          NOT NULL UNIQUE,
    "nombre"       TEXT          NOT NULL,
    "telefono"     TEXT,
    "correo"       TEXT,
    "direccion"    TEXT,
    "activo"       BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)  NOT NULL,
    "createdById"  BIGINT        NOT NULL,
    "updatedById"  BIGINT,

    CONSTRAINT "fk_proveedor_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_proveedor_updatedby"
        FOREIGN KEY ("updatedById") REFERENCES "Usuario"("idUsuario")
);
CREATE INDEX "idx_proveedor_activo" ON "Proveedor"("activo");
CREATE INDEX "idx_proveedor_nombre" ON "Proveedor"("nombre");


-- ═══════════════════════════════════════════════════════════════════
-- 14. PRODUCTO
-- Relación: categoriaId → Categoria, createdById → Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Producto" (
    "idProducto"  BIGSERIAL     PRIMARY KEY,
    "nombre"      TEXT          NOT NULL UNIQUE,
    "descripcion" TEXT,
    "activo"      BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)  NOT NULL,
    "createdById" BIGINT        NOT NULL,
    "updatedById" BIGINT,
    "categoriaId" BIGINT,

    CONSTRAINT "fk_producto_categoria"
        FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("idCategoria"),
    CONSTRAINT "fk_producto_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_producto_updatedby"
        FOREIGN KEY ("updatedById") REFERENCES "Usuario"("idUsuario")
);
CREATE INDEX "idx_producto_categoria" ON "Producto"("categoriaId");


-- ═══════════════════════════════════════════════════════════════════
-- 15. COTIZACION
-- Relación: proveedorId → Proveedor, productoId → Producto,
--           unidadId → UnidadMedida, createdById → Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Cotizacion" (
    "idCotizacion"       BIGSERIAL      PRIMARY KEY,
    "proveedorId"        BIGINT         NOT NULL,
    "productoId"         BIGINT         NOT NULL,
    "unidadId"           BIGINT         NOT NULL,
    "precioUnidad"       DECIMAL(14,4),                      -- Precio normalizado por unidad base
    "precioUnitario"     DECIMAL(14,2)  NOT NULL,             -- Legacy
    "cantidad"           DECIMAL(14,3)  NOT NULL,             -- Legacy
    "presentacionCompra" TEXT,                                 -- Ej: "1 Arroba", "Bulto x 50Kg"
    "precioPresentacion" DECIMAL(14,2),                       -- Precio de la presentación
    "metadata"           JSONB,                                -- Trazabilidad
    "fecha"              TIMESTAMP(3)   NOT NULL,
    "observacion"        TEXT,
    "activo"             BOOLEAN        NOT NULL DEFAULT true,
    "createdAt"          TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3)   NOT NULL,
    "createdById"        BIGINT         NOT NULL,
    "updatedById"        BIGINT,

    CONSTRAINT "fk_cotizacion_proveedor"
        FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("idProveedor"),
    CONSTRAINT "fk_cotizacion_producto"
        FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto"),
    CONSTRAINT "fk_cotizacion_unidad"
        FOREIGN KEY ("unidadId") REFERENCES "UnidadMedida"("idUnidadMedida"),
    CONSTRAINT "fk_cotizacion_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_cotizacion_updatedby"
        FOREIGN KEY ("updatedById") REFERENCES "Usuario"("idUsuario")
);
CREATE INDEX "idx_cotizacion_proveedor" ON "Cotizacion"("proveedorId");
CREATE INDEX "idx_cotizacion_producto"  ON "Cotizacion"("productoId");
CREATE INDEX "idx_cotizacion_fecha"     ON "Cotizacion"("fecha");
CREATE INDEX "idx_cotizacion_activo"    ON "Cotizacion"("activo");


-- ═══════════════════════════════════════════════════════════════════
-- 16. CATEGORIA_RECETA (Categorías de recetas)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "CategoriaReceta" (
    "idCategoriaReceta" BIGSERIAL     PRIMARY KEY,
    "nombre"            TEXT          NOT NULL UNIQUE,
    "activo"            BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"         TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3)  NOT NULL,
    "color"             TEXT          NOT NULL DEFAULT '#6B7280'
);
CREATE INDEX "idx_catreceta_activo" ON "CategoriaReceta"("activo");
CREATE INDEX "idx_catreceta_nombre" ON "CategoriaReceta"("nombre");


-- ═══════════════════════════════════════════════════════════════════
-- 17. RECETA
-- Relación: categoriaId → CategoriaReceta, createdById → Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Receta" (
    "idReceta"      BIGSERIAL     PRIMARY KEY,
    "nombre"        TEXT          NOT NULL UNIQUE,
    "porcionesBase" DECIMAL(14,2),
    "activo"        BOOLEAN       NOT NULL DEFAULT true,
    "categoriaId"   BIGINT,
    "createdAt"     TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3)  NOT NULL,
    "createdById"   BIGINT        NOT NULL,
    "updatedById"   BIGINT,

    CONSTRAINT "fk_receta_categoria"
        FOREIGN KEY ("categoriaId") REFERENCES "CategoriaReceta"("idCategoriaReceta"),
    CONSTRAINT "fk_receta_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_receta_updatedby"
        FOREIGN KEY ("updatedById") REFERENCES "Usuario"("idUsuario")
);
CREATE INDEX "idx_receta_activo"    ON "Receta"("activo");
CREATE INDEX "idx_receta_categoria" ON "Receta"("categoriaId");


-- ═══════════════════════════════════════════════════════════════════
-- 18. RECETA_ITEM (Insumos de cada receta)
-- Relación: recetaId → Receta (CASCADE), productoId → Producto,
--           unidadId → UnidadMedida, proveedorId → Proveedor (opcional)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "RecetaItem" (
    "idRecetaItem" BIGSERIAL         PRIMARY KEY,
    "recetaId"     BIGINT            NOT NULL,
    "productoId"   BIGINT            NOT NULL,
    "unidadId"     BIGINT            NOT NULL,
    "proveedorId"  BIGINT,
    "modo"         "ModoItemReceta"  NOT NULL DEFAULT 'AUTO',
    "cantidad"     DECIMAL(14,3)     NOT NULL,

    CONSTRAINT "fk_recetaitem_receta"
        FOREIGN KEY ("recetaId") REFERENCES "Receta"("idReceta") ON DELETE CASCADE,
    CONSTRAINT "fk_recetaitem_producto"
        FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto"),
    CONSTRAINT "fk_recetaitem_unidad"
        FOREIGN KEY ("unidadId") REFERENCES "UnidadMedida"("idUnidadMedida"),
    CONSTRAINT "fk_recetaitem_proveedor"
        FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("idProveedor")
);
CREATE INDEX "idx_recetaitem_receta"   ON "RecetaItem"("recetaId");
CREATE INDEX "idx_recetaitem_producto" ON "RecetaItem"("productoId");


-- ═══════════════════════════════════════════════════════════════════
-- 19. BODEGA
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Bodega" (
    "idBodega"    BIGSERIAL     PRIMARY KEY,
    "nombre"      TEXT          NOT NULL UNIQUE,
    "descripcion" TEXT,
    "activo"      BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)  NOT NULL
);
CREATE INDEX "idx_bodega_activo" ON "Bodega"("activo");


-- ═══════════════════════════════════════════════════════════════════
-- 20. FACTURA
-- Relación: proveedorId → Proveedor, bodegaId → Bodega
-- UNIQUE: (proveedorId, numero)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Factura" (
    "idFactura"     BIGSERIAL        PRIMARY KEY,
    "proveedorId"   BIGINT           NOT NULL,
    "bodegaId"      BIGINT           NOT NULL,
    "numero"        TEXT             NOT NULL,
    "fecha"         TIMESTAMP(3)     NOT NULL,
    "status"        "InvoiceStatus"  NOT NULL DEFAULT 'DRAFT',
    "observacion"   TEXT,
    "activo"        BOOLEAN          NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3)     NOT NULL,
    "createdById"   BIGINT           NOT NULL,
    "confirmedById" BIGINT,
    "confirmedAt"   TIMESTAMP(3),
    "canceledById"  BIGINT,
    "canceledAt"    TIMESTAMP(3),
    "cancelReason"  TEXT,

    CONSTRAINT "fk_factura_proveedor"
        FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("idProveedor"),
    CONSTRAINT "fk_factura_bodega"
        FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("idBodega"),
    CONSTRAINT "fk_factura_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_factura_confirmedby"
        FOREIGN KEY ("confirmedById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_factura_canceledby"
        FOREIGN KEY ("canceledById") REFERENCES "Usuario"("idUsuario"),

    CONSTRAINT "uq_factura_proveedor_numero" UNIQUE ("proveedorId", "numero")
);
CREATE INDEX "idx_factura_proveedor" ON "Factura"("proveedorId");
CREATE INDEX "idx_factura_bodega"    ON "Factura"("bodegaId");
CREATE INDEX "idx_factura_fecha"     ON "Factura"("fecha");
CREATE INDEX "idx_factura_status"    ON "Factura"("status");


-- ═══════════════════════════════════════════════════════════════════
-- 21. FACTURA_ITEM (Líneas de una factura)
-- Relación: facturaId → Factura (CASCADE), productoId → Producto
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "FacturaItem" (
    "idFacturaItem"  BIGSERIAL     PRIMARY KEY,
    "facturaId"      BIGINT        NOT NULL,
    "productoId"     BIGINT        NOT NULL,
    "unidadId"       BIGINT        NOT NULL,
    "cantidad"       DECIMAL(14,3) NOT NULL,
    "precioUnitario" DECIMAL(14,2) NOT NULL,
    "observacion"    TEXT,

    CONSTRAINT "fk_facturaitem_factura"
        FOREIGN KEY ("facturaId") REFERENCES "Factura"("idFactura") ON DELETE CASCADE,
    CONSTRAINT "fk_facturaitem_producto"
        FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto"),
    CONSTRAINT "fk_facturaitem_unidad"
        FOREIGN KEY ("unidadId") REFERENCES "UnidadMedida"("idUnidadMedida")
);
CREATE INDEX "idx_facturaitem_factura"  ON "FacturaItem"("facturaId");
CREATE INDEX "idx_facturaitem_producto" ON "FacturaItem"("productoId");


-- ═══════════════════════════════════════════════════════════════════
-- 22. INVENTARIO_STOCK (Stock actual por bodega/producto/unidad)
-- UNIQUE: (bodegaId, productoId, unidadId)
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "InventarioStock" (
    "idInventarioStock" BIGSERIAL     PRIMARY KEY,
    "bodegaId"          BIGINT        NOT NULL,
    "productoId"        BIGINT        NOT NULL,
    "unidadId"          BIGINT        NOT NULL,
    "cantidad"          DECIMAL(14,3) NOT NULL DEFAULT 0,
    "createdAt"         TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "fk_stock_bodega"
        FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("idBodega"),
    CONSTRAINT "fk_stock_producto"
        FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto"),
    CONSTRAINT "fk_stock_unidad"
        FOREIGN KEY ("unidadId") REFERENCES "UnidadMedida"("idUnidadMedida"),

    CONSTRAINT "uq_stock_bodega_producto_unidad" UNIQUE ("bodegaId", "productoId", "unidadId")
);
CREATE INDEX "idx_stock_producto" ON "InventarioStock"("productoId");
CREATE INDEX "idx_stock_bodega"   ON "InventarioStock"("bodegaId");


-- ═══════════════════════════════════════════════════════════════════
-- 23. INVENTARIO_MOVIMIENTO (Entrada/Salida/Ajuste de inventario)
-- Relación: bodegaId → Bodega, productoId → Producto,
--           facturaId → Factura (opcional), createdById → Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "InventarioMovimiento" (
    "idMovimiento" BIGSERIAL            PRIMARY KEY,
    "type"         "InventoryMoveType"  NOT NULL,
    "fecha"        TIMESTAMP(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bodegaId"     BIGINT               NOT NULL,
    "productoId"   BIGINT               NOT NULL,
    "unidadId"     BIGINT               NOT NULL,
    "cantidad"     DECIMAL(14,3)        NOT NULL,
    "referencia"   TEXT,
    "facturaId"    BIGINT,
    "createdById"  BIGINT               NOT NULL,

    CONSTRAINT "fk_movimiento_bodega"
        FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("idBodega"),
    CONSTRAINT "fk_movimiento_producto"
        FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto"),
    CONSTRAINT "fk_movimiento_unidad"
        FOREIGN KEY ("unidadId") REFERENCES "UnidadMedida"("idUnidadMedida"),
    CONSTRAINT "fk_movimiento_factura"
        FOREIGN KEY ("facturaId") REFERENCES "Factura"("idFactura"),
    CONSTRAINT "fk_movimiento_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario")
);
CREATE INDEX "idx_movimiento_bodega"   ON "InventarioMovimiento"("bodegaId");
CREATE INDEX "idx_movimiento_producto" ON "InventarioMovimiento"("productoId");
CREATE INDEX "idx_movimiento_factura"  ON "InventarioMovimiento"("facturaId");
CREATE INDEX "idx_movimiento_fecha"    ON "InventarioMovimiento"("fecha");


-- ═══════════════════════════════════════════════════════════════════
-- 24. OLLA (Olla individual por receta - modelo legacy)
-- Relación: recetaId → Receta, createdById → Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "Olla" (
    "idOlla"          BIGSERIAL     PRIMARY KEY,
    "fecha"           TIMESTAMP(3)  NOT NULL,
    "recetaId"        BIGINT        NOT NULL,
    "porciones"       DECIMAL(14,3) NOT NULL,
    "status"          "PotStatus"   NOT NULL DEFAULT 'OPEN',
    "totalReceta"     DECIMAL(14,2),
    "costoPorPorcion" DECIMAL(14,6),
    "snapshot"        JSONB,
    "notas"           TEXT,
    "createdById"     BIGINT        NOT NULL,
    "updatedById"     BIGINT,
    "closedById"      BIGINT,
    "closedAt"        TIMESTAMP(3),
    "createdAt"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "fk_olla_receta"
        FOREIGN KEY ("recetaId") REFERENCES "Receta"("idReceta"),
    CONSTRAINT "fk_olla_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_olla_updatedby"
        FOREIGN KEY ("updatedById") REFERENCES "Usuario"("idUsuario"),
    CONSTRAINT "fk_olla_closedby"
        FOREIGN KEY ("closedById") REFERENCES "Usuario"("idUsuario")
);
CREATE INDEX "idx_olla_fecha"   ON "Olla"("fecha");
CREATE INDEX "idx_olla_receta"  ON "Olla"("recetaId");
CREATE INDEX "idx_olla_status"  ON "Olla"("status");


-- ═══════════════════════════════════════════════════════════════════
-- 25. OLLA_PEDIDO (Olla multi-receta con historial)
-- Relación: createdById → Usuario
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "OllaPedido" (
    "idOllaPedido" BIGSERIAL     PRIMARY KEY,
    "nombre"       TEXT          NOT NULL,
    "fecha"        TIMESTAMP(3)  NOT NULL,
    "notas"        TEXT,
    "totalCosto"   DECIMAL(14,2),
    "status"       TEXT          NOT NULL DEFAULT 'BORRADOR',
    "activo"       BOOLEAN       NOT NULL DEFAULT true,
    "createdById"  BIGINT        NOT NULL,
    "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "fk_ollapedido_createdby"
        FOREIGN KEY ("createdById") REFERENCES "Usuario"("idUsuario")
);
CREATE INDEX "idx_ollapedido_fecha"  ON "OllaPedido"("fecha");
CREATE INDEX "idx_ollapedido_status" ON "OllaPedido"("status");
CREATE INDEX "idx_ollapedido_activo" ON "OllaPedido"("activo");


-- ═══════════════════════════════════════════════════════════════════
-- 26. OLLA_PEDIDO_ITEM (Recetas dentro de una OllaPedido)
-- Relación: ollaPedidoId → OllaPedido (CASCADE), recetaId → Receta
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE "OllaPedidoItem" (
    "idOllaPedidoItem" BIGSERIAL     PRIMARY KEY,
    "ollaPedidoId"     BIGINT        NOT NULL,
    "recetaId"         BIGINT        NOT NULL,
    "porciones"        DECIMAL(14,2) NOT NULL,
    "totalReceta"      DECIMAL(14,2),
    "costoPorPorcion"  DECIMAL(14,6),
    "snapshot"         JSONB,                              -- Snapshot completo del cálculo
    "createdAt"        TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fk_ollapedidoitem_pedido"
        FOREIGN KEY ("ollaPedidoId") REFERENCES "OllaPedido"("idOllaPedido") ON DELETE CASCADE,
    CONSTRAINT "fk_ollapedidoitem_receta"
        FOREIGN KEY ("recetaId") REFERENCES "Receta"("idReceta")
);
CREATE INDEX "idx_ollapedidoitem_pedido" ON "OllaPedidoItem"("ollaPedidoId");


-- ═══════════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- Total: 26 tablas + 5 enums
-- ═══════════════════════════════════════════════════════════════════
