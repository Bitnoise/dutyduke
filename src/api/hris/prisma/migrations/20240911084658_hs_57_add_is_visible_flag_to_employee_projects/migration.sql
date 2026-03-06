/*
  Warnings:

  - Added the required column `isVisible` to the `EmployeeProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeProject" ADD COLUMN     "isVisible" BOOLEAN NOT NULL;
