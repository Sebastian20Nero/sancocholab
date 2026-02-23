/*
  Warnings:

  - You are about to drop the column `username` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Usuario_username_key";

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "username";
