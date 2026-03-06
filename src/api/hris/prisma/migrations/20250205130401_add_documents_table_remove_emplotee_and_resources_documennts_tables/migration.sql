/*
  Warnings:

  - You are about to drop the `EmployeeDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmployeeDocument" DROP CONSTRAINT "EmployeeDocument_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentDocument" DROP CONSTRAINT "EquipmentDocument_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "documentIds" TEXT[];

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "documentIds" TEXT[];

-- DropTable
DROP TABLE "EmployeeDocument";

-- DropTable
DROP TABLE "EquipmentDocument";

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expDate" TIMESTAMP(3),
    "category" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_filePath_key" ON "Document"("filePath");
