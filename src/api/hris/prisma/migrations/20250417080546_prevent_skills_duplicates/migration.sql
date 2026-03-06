/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,skillId]` on the table `EmployeeSkill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSkill_employeeId_skillId_key" ON "EmployeeSkill"("employeeId", "skillId");
