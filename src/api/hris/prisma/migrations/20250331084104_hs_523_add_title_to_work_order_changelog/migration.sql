/*
  Warnings:

  - You are about to drop the column `creatorId` on the `WorkOrderChangelog` table. All the data in the column will be lost.
  - Added the required column `creator` to the `WorkOrderChangelog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkOrderChangelog" DROP COLUMN "creatorId",
ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "title" TEXT;
