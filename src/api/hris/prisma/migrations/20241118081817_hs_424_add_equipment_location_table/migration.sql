/*
  Warnings:

  - You are about to drop the column `location` on the `Equipment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "location",
ADD COLUMN     "locationId" TEXT;

-- CreateTable
CREATE TABLE "EquipmentLocalization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EquipmentLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_locationId_key" ON "Equipment"("locationId");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "EquipmentLocalization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
