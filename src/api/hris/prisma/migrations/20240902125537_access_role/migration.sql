/*
  Warnings:

  - You are about to drop the column `role` on the `Identity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Identity" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "IdentityRole" (
    "identityId" TEXT NOT NULL,
    "role" "AccessRole" NOT NULL,

    CONSTRAINT "IdentityRole_pkey" PRIMARY KEY ("identityId","role")
);

-- AddForeignKey
ALTER TABLE "IdentityRole" ADD CONSTRAINT "IdentityRole_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
