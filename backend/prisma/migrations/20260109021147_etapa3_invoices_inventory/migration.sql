-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."InventoryMoveType" AS ENUM ('IN', 'OUT', 'ADJUST');

-- CreateTable
CREATE TABLE "public"."Bodega" (
    "idBodega" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bodega_pkey" PRIMARY KEY ("idBodega")
);

-- CreateTable
CREATE TABLE "public"."Factura" (
    "idFactura" BIGSERIAL NOT NULL,
    "proveedorId" BIGINT NOT NULL,
    "bodegaId" BIGINT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" BIGINT NOT NULL,
    "confirmedById" BIGINT,
    "confirmedAt" TIMESTAMP(3),
    "canceledById" BIGINT,
    "canceledAt" TIMESTAMP(3),
    "cancelReason" TEXT,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("idFactura")
);

-- CreateTable
CREATE TABLE "public"."FacturaItem" (
    "idFacturaItem" BIGSERIAL NOT NULL,
    "facturaId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,
    "unidadId" BIGINT NOT NULL,
    "cantidad" DECIMAL(14,3) NOT NULL,
    "precioUnitario" DECIMAL(14,2) NOT NULL,
    "observacion" TEXT,

    CONSTRAINT "FacturaItem_pkey" PRIMARY KEY ("idFacturaItem")
);

-- CreateTable
CREATE TABLE "public"."InventarioStock" (
    "idInventarioStock" BIGSERIAL NOT NULL,
    "bodegaId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,
    "unidadId" BIGINT NOT NULL,
    "cantidad" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventarioStock_pkey" PRIMARY KEY ("idInventarioStock")
);

-- CreateTable
CREATE TABLE "public"."InventarioMovimiento" (
    "idMovimiento" BIGSERIAL NOT NULL,
    "type" "public"."InventoryMoveType" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bodegaId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,
    "unidadId" BIGINT NOT NULL,
    "cantidad" DECIMAL(14,3) NOT NULL,
    "referencia" TEXT,
    "facturaId" BIGINT,
    "createdById" BIGINT NOT NULL,

    CONSTRAINT "InventarioMovimiento_pkey" PRIMARY KEY ("idMovimiento")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bodega_nombre_key" ON "public"."Bodega"("nombre");

-- CreateIndex
CREATE INDEX "Bodega_activo_idx" ON "public"."Bodega"("activo");

-- CreateIndex
CREATE INDEX "Factura_proveedorId_idx" ON "public"."Factura"("proveedorId");

-- CreateIndex
CREATE INDEX "Factura_bodegaId_idx" ON "public"."Factura"("bodegaId");

-- CreateIndex
CREATE INDEX "Factura_fecha_idx" ON "public"."Factura"("fecha");

-- CreateIndex
CREATE INDEX "Factura_status_idx" ON "public"."Factura"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_proveedorId_numero_key" ON "public"."Factura"("proveedorId", "numero");

-- CreateIndex
CREATE INDEX "FacturaItem_facturaId_idx" ON "public"."FacturaItem"("facturaId");

-- CreateIndex
CREATE INDEX "FacturaItem_productoId_idx" ON "public"."FacturaItem"("productoId");

-- CreateIndex
CREATE INDEX "InventarioStock_productoId_idx" ON "public"."InventarioStock"("productoId");

-- CreateIndex
CREATE INDEX "InventarioStock_bodegaId_idx" ON "public"."InventarioStock"("bodegaId");

-- CreateIndex
CREATE UNIQUE INDEX "InventarioStock_bodegaId_productoId_unidadId_key" ON "public"."InventarioStock"("bodegaId", "productoId", "unidadId");

-- CreateIndex
CREATE INDEX "InventarioMovimiento_bodegaId_idx" ON "public"."InventarioMovimiento"("bodegaId");

-- CreateIndex
CREATE INDEX "InventarioMovimiento_productoId_idx" ON "public"."InventarioMovimiento"("productoId");

-- CreateIndex
CREATE INDEX "InventarioMovimiento_facturaId_idx" ON "public"."InventarioMovimiento"("facturaId");

-- CreateIndex
CREATE INDEX "InventarioMovimiento_fecha_idx" ON "public"."InventarioMovimiento"("fecha");

-- AddForeignKey
ALTER TABLE "public"."Factura" ADD CONSTRAINT "Factura_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedor"("idProveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Factura" ADD CONSTRAINT "Factura_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "public"."Bodega"("idBodega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Factura" ADD CONSTRAINT "Factura_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Factura" ADD CONSTRAINT "Factura_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Factura" ADD CONSTRAINT "Factura_canceledById_fkey" FOREIGN KEY ("canceledById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacturaItem" ADD CONSTRAINT "FacturaItem_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "public"."Factura"("idFactura") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacturaItem" ADD CONSTRAINT "FacturaItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacturaItem" ADD CONSTRAINT "FacturaItem_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "public"."UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioStock" ADD CONSTRAINT "InventarioStock_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "public"."Bodega"("idBodega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioStock" ADD CONSTRAINT "InventarioStock_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioStock" ADD CONSTRAINT "InventarioStock_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "public"."UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioMovimiento" ADD CONSTRAINT "InventarioMovimiento_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "public"."Bodega"("idBodega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioMovimiento" ADD CONSTRAINT "InventarioMovimiento_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioMovimiento" ADD CONSTRAINT "InventarioMovimiento_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "public"."UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioMovimiento" ADD CONSTRAINT "InventarioMovimiento_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "public"."Factura"("idFactura") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventarioMovimiento" ADD CONSTRAINT "InventarioMovimiento_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
