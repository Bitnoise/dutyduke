/*
  Warnings:

  - You are about to drop the column `additionalEmails` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "additionalEmails";

-- CreateTable
CREATE TABLE "AdditionalEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailHash" TEXT,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "AdditionalEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalEmail_email_key" ON "AdditionalEmail"("email");

-- AddForeignKey
ALTER TABLE "AdditionalEmail" ADD CONSTRAINT "AdditionalEmail_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
