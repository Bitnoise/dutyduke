-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateTable
CREATE TABLE "EmployeeEarnings" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EmployeeEarnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeePrimarySkill" (
    "type" "SkillType" NOT NULL,
    "employeeId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "EmployeePrimarySkill_pkey" PRIMARY KEY ("employeeId","skillId")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePrimarySkill_skillId_key" ON "EmployeePrimarySkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- AddForeignKey
ALTER TABLE "EmployeeEarnings" ADD CONSTRAINT "EmployeeEarnings_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
