/*
  Warnings:

  - You are about to drop the `EmployeePhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeePhoto" DROP CONSTRAINT "EmployeePhoto_employeeId_fkey";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "photosIds" TEXT[];

-- DropTable
DROP TABLE "EmployeePhoto";
