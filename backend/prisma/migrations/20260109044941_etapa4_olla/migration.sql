-- CreateEnum
CREATE TYPE "public"."PotStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "public"."Olla" (
    "idOlla" BIGSERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "recetaId" BIGINT NOT NULL,
    "porciones" DECIMAL(14,3) NOT NULL,
    "status" "public"."PotStatus" NOT NULL DEFAULT 'OPEN',
    "totalReceta" DECIMAL(14,2),
    "costoPorPorcion" DECIMAL(14,6),
    "snapshot" JSONB,
    "notas" TEXT,
    "createdById" BIGINT NOT NULL,
    "updatedById" BIGINT,
    "closedById" BIGINT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Olla_pkey" PRIMARY KEY ("idOlla")
);

-- CreateIndex
CREATE INDEX "Olla_fecha_idx" ON "public"."Olla"("fecha");

-- CreateIndex
CREATE INDEX "Olla_recetaId_idx" ON "public"."Olla"("recetaId");

-- CreateIndex
CREATE INDEX "Olla_status_idx" ON "public"."Olla"("status");

-- AddForeignKey
ALTER TABLE "public"."Olla" ADD CONSTRAINT "Olla_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "public"."Receta"("idReceta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Olla" ADD CONSTRAINT "Olla_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Olla" ADD CONSTRAINT "Olla_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Olla" ADD CONSTRAINT "Olla_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "public"."Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;
