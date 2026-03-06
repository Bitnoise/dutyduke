/*
  Warnings:

  - The values [HR,OFFICE] on the enum `AccessRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[emailHash]` on the table `Identity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccessRole_new" AS ENUM ('OWNER', 'EMPLOYEE');
ALTER TABLE "IdentityRole" ALTER COLUMN "role" TYPE "AccessRole_new" USING ("role"::text::"AccessRole_new");
ALTER TYPE "AccessRole" RENAME TO "AccessRole_old";
ALTER TYPE "AccessRole_new" RENAME TO "AccessRole";
DROP TYPE "AccessRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Identity" ADD COLUMN     "emailHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Identity_emailHash_key" ON "Identity"("emailHash");
