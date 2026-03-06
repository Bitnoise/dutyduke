/*
  Warnings:

  - You are about to drop the `EmployeePrimarySkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EmployeePrimarySkill";

-- CreateTable
CREATE TABLE "EmployeeSkill" (
    "type" "SkillType" NOT NULL,
    "employeeId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "EmployeeSkill_pkey" PRIMARY KEY ("employeeId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSkill_skillId_key" ON "EmployeeSkill"("skillId");
