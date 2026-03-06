/*
  Warnings:

  - You are about to drop the column `address` on the `Location` table. All the data in the column will be lost.
  - Added the required column `contactPerson` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address1` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "contactPerson" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ALTER COLUMN "taxId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "address",
ADD COLUMN     "address1" TEXT NOT NULL,
ADD COLUMN     "address2" TEXT;
