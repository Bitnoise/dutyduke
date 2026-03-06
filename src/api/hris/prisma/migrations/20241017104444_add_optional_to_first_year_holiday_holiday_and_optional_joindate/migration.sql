/*
  Warnings:

  - The `holiday` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "joinDate" DROP NOT NULL,
DROP COLUMN "holiday",
ADD COLUMN     "holiday" INTEGER;
