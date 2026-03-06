-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en');

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'en',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
