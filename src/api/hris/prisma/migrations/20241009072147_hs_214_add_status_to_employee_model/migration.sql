-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('INVITED', 'INACTIVE', 'ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'INACTIVE',
ALTER COLUMN "identityId" DROP NOT NULL;
