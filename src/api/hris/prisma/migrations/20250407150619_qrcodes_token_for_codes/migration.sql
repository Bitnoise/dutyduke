/*
  Warnings:

  - Added the required column `token` to the `QrCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QrCode" ADD COLUMN "token" TEXT NOT NULL;
