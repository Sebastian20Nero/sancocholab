-- CreateTable
CREATE TABLE "public"."Proveedor" (
    "idProveedor" BIGSERIAL NOT NULL,
    "nit" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "direccion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" BIGINT NOT NULL,
    "updatedById" BIGINT,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("idProveedor")
);

-- CreateTable
CREATE TABLE "public"."Producto" (
    "idProducto" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" BIGINT NOT NULL,
    "updatedById" BIGINT,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "public"."UnidadMedida" (
    "idUnidadMedida" BIGSERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnidadMedida_pkey" PRIMARY KEY ("idUnidadMedida")
);

-- CreateTable
CREATE TABLE "public"."Cotizacion" (
    "idCotizacion" BIGSERIAL NOT NULL,
    "proveedorId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,
    "unidadId" BIGINT NOT NULL,
    "precioUnitario" DECIMAL(14,2) NOT NULL,
    "cantidad" DECIMAL(14,3) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" BIGINT NOT NULL,
    "updatedById" BIGINT,

    CONSTRAINT "Cotizacion_pkey" PRIMARY KEY ("idCotizacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_nit_key" ON "public"."Proveedor"("nit");

-- CreateIndex
CREATE INDEX "Proveedor_activo_idx" ON "public"."Proveedor"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_nombre_key" ON "public"."Producto"("nombre");

-- CreateIndex
CREATE INDEX "Producto_activo_idx" ON "public"."Producto"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadMedida_key_key" ON "public"."UnidadMedida"("key");

-- CreateIndex
CREATE INDEX "Cotizacion_proveedorId_idx" ON "public"."Cotizacion"("proveedorId");

-- CreateIndex
CREATE INDEX "Cotizacion_productoId_idx" ON "public"."Cotizacion"("productoId");

-- CreateIndex
CREATE INDEX "Cotizacion_fecha_idx" ON "public"."Cotizacion"("fecha");

-- CreateIndex
CREATE INDEX "Cotizacion_activo_idx" ON "public"."Cotizacion"("activo");

-- AddForeignKey
ALTER TABLE "public"."Proveedor" ADD CONSTRAINT "Proveedor_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Proveedor" ADD CONSTRAINT "Proveedor_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cotizacion" ADD CONSTRAINT "Cotizacion_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedor"("idProveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cotizacion" ADD CONSTRAINT "Cotizacion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cotizacion" ADD CONSTRAINT "Cotizacion_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "public"."UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cotizacion" ADD CONSTRAINT "Cotizacion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cotizacion" ADD CONSTRAINT "Cotizacion_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;
