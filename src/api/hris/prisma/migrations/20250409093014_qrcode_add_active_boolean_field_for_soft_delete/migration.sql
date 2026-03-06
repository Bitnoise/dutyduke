/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `Inquiry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inquiry" DROP COLUMN "scheduledAt";

-- AlterTable
ALTER TABLE "QrCode" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
