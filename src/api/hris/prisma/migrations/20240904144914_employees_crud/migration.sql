/*
  Warnings:

  - Added the required column `company` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "company" TEXT,
ADD COLUMN     "daysOff" INTEGER,
ALTER COLUMN "hobby" DROP NOT NULL,
ALTER COLUMN "hobby" SET DATA TYPE TEXT;
