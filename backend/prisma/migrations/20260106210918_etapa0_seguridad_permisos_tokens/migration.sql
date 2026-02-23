/*
  Warnings:

  - Added the required column `updatedAt` to the `Rol` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserTokenType" AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFY');

-- AlterTable
ALTER TABLE "public"."Persona" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Rol" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Usuario" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."Permiso" (
    "idPermiso" BIGSERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("idPermiso")
);

-- CreateTable
CREATE TABLE "public"."RolPermiso" (
    "rolId" BIGINT NOT NULL,
    "permisoId" BIGINT NOT NULL,

    CONSTRAINT "RolPermiso_pkey" PRIMARY KEY ("rolId","permisoId")
);

-- CreateTable
CREATE TABLE "public"."UsuarioPermiso" (
    "usuarioId" BIGINT NOT NULL,
    "permisoId" BIGINT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UsuarioPermiso_pkey" PRIMARY KEY ("usuarioId","permisoId")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "idRefreshToken" BIGSERIAL NOT NULL,
    "usuarioId" BIGINT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("idRefreshToken")
);

-- CreateTable
CREATE TABLE "public"."UserToken" (
    "idUserToken" BIGSERIAL NOT NULL,
    "usuarioId" BIGINT NOT NULL,
    "type" "public"."UserTokenType" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("idUserToken")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_key_key" ON "public"."Permiso"("key");

-- CreateIndex
CREATE INDEX "RolPermiso_permisoId_idx" ON "public"."RolPermiso"("permisoId");

-- CreateIndex
CREATE INDEX "UsuarioPermiso_permisoId_idx" ON "public"."UsuarioPermiso"("permisoId");

-- CreateIndex
CREATE INDEX "RefreshToken_usuarioId_idx" ON "public"."RefreshToken"("usuarioId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "public"."RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "RefreshToken_revoked_idx" ON "public"."RefreshToken"("revoked");

-- CreateIndex
CREATE INDEX "UserToken_usuarioId_type_idx" ON "public"."UserToken"("usuarioId", "type");

-- CreateIndex
CREATE INDEX "UserToken_expiresAt_idx" ON "public"."UserToken"("expiresAt");

-- CreateIndex
CREATE INDEX "UsuarioRol_rolId_idx" ON "public"."UsuarioRol"("rolId");

-- AddForeignKey
ALTER TABLE "public"."RolPermiso" ADD CONSTRAINT "RolPermiso_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "public"."Rol"("idRol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolPermiso" ADD CONSTRAINT "RolPermiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "public"."Permiso"("idPermiso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioPermiso" ADD CONSTRAINT "UsuarioPermiso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioPermiso" ADD CONSTRAINT "UsuarioPermiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "public"."Permiso"("idPermiso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserToken" ADD CONSTRAINT "UserToken_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;
