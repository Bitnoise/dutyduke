-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "status" "DocumentStatus"[];
