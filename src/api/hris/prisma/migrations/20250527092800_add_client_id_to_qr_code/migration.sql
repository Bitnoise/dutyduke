/*
  Warnings:

  - Added the required column `clientId` to the `QrCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QrCode" ADD COLUMN     "clientId" TEXT NOT NULL;
