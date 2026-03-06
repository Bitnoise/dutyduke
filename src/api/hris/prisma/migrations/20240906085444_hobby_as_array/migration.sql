/*
  Warnings:

  - The `hobby` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "additionalEmails" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "hobby",
ADD COLUMN     "hobby" TEXT[] DEFAULT ARRAY[]::TEXT[];
