-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('HOLIDAY', 'SICK', 'PERSONAL');

-- CreateEnum
CREATE TYPE "AbsenceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Absence" (
    "id" TEXT NOT NULL,
    "type" "AbsenceType" NOT NULL DEFAULT 'HOLIDAY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "days" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "status" "AbsenceStatus" NOT NULL DEFAULT 'PENDING',
    "issuerId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);
