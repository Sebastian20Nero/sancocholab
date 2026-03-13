-- CreateTable
CREATE TABLE "public"."OllaPedido" (
    "idOllaPedido" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "notas" TEXT,
    "totalCosto" DECIMAL(14,2),
    "status" TEXT NOT NULL DEFAULT 'BORRADOR',
    "createdById" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OllaPedido_pkey" PRIMARY KEY ("idOllaPedido")
);

-- CreateTable
CREATE TABLE "public"."OllaPedidoItem" (
    "idOllaPedidoItem" BIGSERIAL NOT NULL,
    "ollaPedidoId" BIGINT NOT NULL,
    "recetaId" BIGINT NOT NULL,
    "porciones" DECIMAL(14,2) NOT NULL,
    "totalReceta" DECIMAL(14,2),
    "costoPorPorcion" DECIMAL(14,6),
    "snapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OllaPedidoItem_pkey" PRIMARY KEY ("idOllaPedidoItem")
);

-- CreateIndex
CREATE INDEX "OllaPedido_fecha_idx" ON "public"."OllaPedido"("fecha");

-- CreateIndex
CREATE INDEX "OllaPedido_status_idx" ON "public"."OllaPedido"("status");

-- CreateIndex
CREATE INDEX "OllaPedidoItem_ollaPedidoId_idx" ON "public"."OllaPedidoItem"("ollaPedidoId");

-- AddForeignKey
ALTER TABLE "public"."OllaPedido" ADD CONSTRAINT "OllaPedido_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OllaPedidoItem" ADD CONSTRAINT "OllaPedidoItem_ollaPedidoId_fkey" FOREIGN KEY ("ollaPedidoId") REFERENCES "public"."OllaPedido"("idOllaPedido") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OllaPedidoItem" ADD CONSTRAINT "OllaPedidoItem_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "public"."Receta"("idReceta") ON DELETE RESTRICT ON UPDATE CASCADE;
