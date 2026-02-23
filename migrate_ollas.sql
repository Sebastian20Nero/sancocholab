-- =============================================================
-- Migración: OllaPedido (olla del día con múltiples recetas)
-- =============================================================

CREATE TABLE IF NOT EXISTS "OllaPedido" (
    "idOllaPedido"  BIGSERIAL     PRIMARY KEY,
    "nombre"        TEXT          NOT NULL,
    "fecha"         DATE          NOT NULL,
    "notas"         TEXT,
    "totalCosto"    DECIMAL(14,2),
    "status"        TEXT          NOT NULL DEFAULT 'BORRADOR',
    "createdById"   BIGINT        NOT NULL REFERENCES "Usuario"("idUsuario"),
    "createdAt"     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "OllaPedidoItem" (
    "idOllaPedidoItem"  BIGSERIAL     PRIMARY KEY,
    "ollaPedidoId"      BIGINT        NOT NULL REFERENCES "OllaPedido"("idOllaPedido") ON DELETE CASCADE,
    "recetaId"          BIGINT        NOT NULL REFERENCES "Receta"("idReceta"),
    "porciones"         DECIMAL(14,2) NOT NULL,
    "totalReceta"       DECIMAL(14,2),
    "costoPorPorcion"   DECIMAL(14,6),
    "snapshot"          JSONB,
    "createdAt"         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_olla_pedido_fecha"     ON "OllaPedido"("fecha");
CREATE INDEX IF NOT EXISTS "idx_olla_pedido_status"    ON "OllaPedido"("status");
CREATE INDEX IF NOT EXISTS "idx_olla_pedido_item_olla" ON "OllaPedidoItem"("ollaPedidoId");

INSERT INTO "Permiso" ("key", "descripcion", "activo", "createdAt", "updatedAt")
VALUES 
  ('OLLA_READ',   'Ver historial de ollas',  true, NOW(), NOW()),
  ('OLLA_CREATE', 'Crear y guardar ollas',   true, NOW(), NOW())
ON CONFLICT ("key") DO NOTHING;
