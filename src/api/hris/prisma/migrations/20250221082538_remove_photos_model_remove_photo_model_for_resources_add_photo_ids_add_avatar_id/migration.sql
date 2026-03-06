/*
  Warnings:

  - You are about to drop the `EquipmentPhoto` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[avatarId]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EquipmentPhoto" DROP CONSTRAINT "EquipmentPhoto_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "photoIds" TEXT[];

-- DropTable
DROP TABLE "EquipmentPhoto";

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_avatarId_key" ON "Equipment"("avatarId");
