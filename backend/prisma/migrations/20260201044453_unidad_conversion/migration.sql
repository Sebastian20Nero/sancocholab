-- CreateTable
CREATE TABLE "public"."UnidadConversion" (
    "idUnidadConversion" BIGSERIAL NOT NULL,
    "fromUnidadId" BIGINT NOT NULL,
    "toUnidadId" BIGINT NOT NULL,
    "factor" DECIMAL(18,10) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnidadConversion_pkey" PRIMARY KEY ("idUnidadConversion")
);

-- CreateIndex
CREATE INDEX "idx_unidad_conversion_from" ON "public"."UnidadConversion"("fromUnidadId");

-- CreateIndex
CREATE INDEX "idx_unidad_conversion_to" ON "public"."UnidadConversion"("toUnidadId");

-- CreateIndex
CREATE INDEX "idx_unidad_conversion_activo" ON "public"."UnidadConversion"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "uq_unidad_conversion_from_to" ON "public"."UnidadConversion"("fromUnidadId", "toUnidadId");

-- AddForeignKey
ALTER TABLE "public"."UnidadConversion" ADD CONSTRAINT "UnidadConversion_fromUnidadId_fkey" FOREIGN KEY ("fromUnidadId") REFERENCES "public"."UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UnidadConversion" ADD CONSTRAINT "UnidadConversion_toUnidadId_fkey" FOREIGN KEY ("toUnidadId") REFERENCES "public"."UnidadMedida"("idUnidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;
