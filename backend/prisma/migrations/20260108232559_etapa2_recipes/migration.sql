-- CreateEnum
CREATE TYPE "public"."ModoItemReceta" AS ENUM ('AUTO', 'BY_PROVIDER', 'HYPOTHETICAL');

-- CreateTable
CREATE TABLE "public"."CategoriaReceta" (
    "idCategoriaReceta" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriaReceta_pkey" PRIMARY KEY ("idCategoriaReceta")
);

-- CreateTable
CREATE TABLE "public"."Receta" (
    "idReceta" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcionesBase" DECIMAL(14,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "categoriaId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" BIGINT NOT NULL,
    "updatedById" BIGINT,

    CONSTRAINT "Receta_pkey" PRIMARY KEY ("idReceta")
);

-- CreateTable
CREATE TABLE "public"."RecetaItem" (
    "idRecetaItem" BIGSERIAL NOT NULL,
    "recetaId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,
    "unidadId" BIGINT NOT NULL,
    "proveedorId" BIGINT,
    "modo" "public"."ModoItemReceta" NOT NULL DEFAULT 'AUTO',
    "cantidad" DECIMAL(14,3) NOT NULL,

    CONSTRAINT "RecetaItem_pkey" PRIMARY KEY ("idRecetaItem")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaReceta_nombre_key" ON "public"."CategoriaReceta"("nombre");

-- CreateIndex
CREATE INDEX "CategoriaReceta_activo_idx" ON "public"."CategoriaReceta"("activo");

-- CreateIndex
CREATE INDEX "CategoriaReceta_nombre_idx" ON "public"."CategoriaReceta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Receta_nombre_key" ON "public"."Receta"("nombre");

-- CreateIndex
CREATE INDEX "Receta_activo_idx" ON "public"."Receta"("activo");

-- CreateIndex
CREATE INDEX "Receta_categoriaId_idx" ON "public"."Receta"("categoriaId");

-- CreateIndex
CREATE INDEX "RecetaItem_recetaId_idx" ON "public"."RecetaItem"("recetaId");

-- CreateIndex
CREATE INDEX "RecetaItem_productoId_idx" ON "public"."RecetaItem"("productoId");

-- AddForeignKey
ALTER TABLE "public"."Receta" ADD CONSTRAINT "Receta_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."CategoriaReceta"("idCategoriaReceta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Receta" ADD CONSTRAINT "Receta_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Receta" ADD CONSTRAINT "Receta_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecetaItem" ADD CONSTRAINT "RecetaItem_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "public"."Receta"("idReceta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecetaItem" ADD CONSTRAINT "RecetaItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecetaItem" ADD CONSTRAINT "RecetaItem_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "public"."UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecetaItem" ADD CONSTRAINT "RecetaItem_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedor"("idProveedor") ON DELETE SET NULL ON UPDATE CASCADE;
