-- AlterTable
ALTER TABLE "Absence" ADD COLUMN     "halfEnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "halfStart" BOOLEAN NOT NULL DEFAULT false;
