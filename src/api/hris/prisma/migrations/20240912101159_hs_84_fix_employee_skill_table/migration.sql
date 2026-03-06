/*
  Warnings:

  - The primary key for the `EmployeeSkill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `EmployeeSkill` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "EmployeeSkill_skillId_key";

-- AlterTable
ALTER TABLE "EmployeeSkill" DROP CONSTRAINT "EmployeeSkill_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "EmployeeSkill_pkey" PRIMARY KEY ("id");
