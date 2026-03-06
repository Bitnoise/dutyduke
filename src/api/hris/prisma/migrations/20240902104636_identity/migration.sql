/*
  Warnings:

  - You are about to drop the `AuthUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuthUser";

-- CreateTable
CREATE TABLE "Identity" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AccessRole"[],

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityAdmin" (
    "adminId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,

    CONSTRAINT "IdentityAdmin_pkey" PRIMARY KEY ("adminId","identityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Identity_email_key" ON "Identity"("email");

-- AddForeignKey
ALTER TABLE "IdentityAdmin" ADD CONSTRAINT "IdentityAdmin_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
