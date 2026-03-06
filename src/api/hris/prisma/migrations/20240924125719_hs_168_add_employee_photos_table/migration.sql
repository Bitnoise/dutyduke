/*
  Warnings:

  - A unique constraint covering the columns `[avatarId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "avatarId" TEXT;

-- CreateTable
CREATE TABLE "EmployeePhotos" (
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "EmployeePhotos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePhotos_filePath_key" ON "EmployeePhotos"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_avatarId_key" ON "Employee"("avatarId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "EmployeePhotos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePhotos" ADD CONSTRAINT "EmployeePhotos_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
