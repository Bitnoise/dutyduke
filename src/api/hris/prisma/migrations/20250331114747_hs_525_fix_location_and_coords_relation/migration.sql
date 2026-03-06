/*
  Warnings:

  - You are about to drop the column `coordinatesId` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `Coordinates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Coordinates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_coordinatesId_fkey";

-- AlterTable
ALTER TABLE "Coordinates" ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "coordinatesId";

-- CreateIndex
CREATE UNIQUE INDEX "Coordinates_locationId_key" ON "Coordinates"("locationId");

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
