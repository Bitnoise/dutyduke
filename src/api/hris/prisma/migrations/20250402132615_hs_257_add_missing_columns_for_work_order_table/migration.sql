/*
  Warnings:

  - Added the required column `contactPerson` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkOrder" ADD COLUMN     "contactPerson" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "costEstimate" DROP NOT NULL;
