/*
  Warnings:

  - You are about to drop the column `locationId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QrCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkOrderChangelog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkOrderChangelog" DROP CONSTRAINT "WorkOrderChangelog_workOrderId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "locationId";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Inquiry";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "QrCode";

-- DropTable
DROP TABLE "WorkOrder";

-- DropTable
DROP TABLE "WorkOrderChangelog";

-- DropEnum
DROP TYPE "ClientStatus";

-- DropEnum
DROP TYPE "InquiryStatus";

-- DropEnum
DROP TYPE "WorkOrderChangeType";

-- DropEnum
DROP TYPE "WorkOrderStatus";
