/*
  Warnings:

  - Added the required column `workOrderId` to the `WorkOrderChangelog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkOrderChangelog" ADD COLUMN     "workOrderId" TEXT NOT NULL;
