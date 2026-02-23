-- AlterTable
ALTER TABLE "public"."Cotizacion" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "precioUnidad" DECIMAL(14,4),
ADD COLUMN     "presentacionCompra" TEXT;
