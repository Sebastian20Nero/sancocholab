ALTER TABLE "public"."OllaPedido"
ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "OllaPedido_activo_idx" ON "public"."OllaPedido"("activo");
