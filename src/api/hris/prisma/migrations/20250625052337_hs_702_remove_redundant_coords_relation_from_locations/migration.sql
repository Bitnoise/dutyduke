/*
  Warnings:

  - You are about to drop the `Coordinates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coordinates" DROP CONSTRAINT "Coordinates_locationId_fkey";

-- DropTable
DROP TABLE "Coordinates";
