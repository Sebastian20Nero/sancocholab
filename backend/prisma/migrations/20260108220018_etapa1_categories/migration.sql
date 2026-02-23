-- DropIndex
DROP INDEX "public"."Producto_activo_idx";

-- AlterTable
ALTER TABLE "public"."Producto" ADD COLUMN     "categoriaId" BIGINT;

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "idCategoria" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "public"."Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Categoria_activo_idx" ON "public"."Categoria"("activo");

-- CreateIndex
CREATE INDEX "Categoria_nombre_idx" ON "public"."Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Producto_categoriaId_idx" ON "public"."Producto"("categoriaId");

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("idCategoria") ON DELETE SET NULL ON UPDATE CASCADE;
