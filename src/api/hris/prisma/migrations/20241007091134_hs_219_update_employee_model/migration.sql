/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `daysOff` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `hobby` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `EmployeePhotos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workEmail]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Made the column `joinDate` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('EMPLOYMENT_CONTRACT', 'WORK_CONTRACT', 'COMMISSION_CONTRACT', 'B2B_CONTRACT', 'AGENCY_CONTRACT', 'OTHER');

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeePhotos" DROP CONSTRAINT "EmployeePhotos_employeeId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "birthDate",
DROP COLUMN "company",
DROP COLUMN "daysOff",
DROP COLUMN "hobby",
ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "hobbies" TEXT[],
ADD COLUMN     "holiday" TEXT,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "workEmailHash" TEXT,
ALTER COLUMN "additionalEmails" DROP DEFAULT,
ALTER COLUMN "joinDate" SET NOT NULL,
ALTER COLUMN "joinDate" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "EmployeePhotos";

-- CreateTable
CREATE TABLE "EmployeePhoto" (
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "EmployeePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePhoto_filePath_key" ON "EmployeePhoto"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_workEmail_key" ON "Employee"("workEmail");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "EmployeePhoto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePhoto" ADD CONSTRAINT "EmployeePhoto_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
