/*
  Warnings:

  - You are about to drop the `organization_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization_agreements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_addresses" DROP CONSTRAINT "organization_addresses_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_agreements" DROP CONSTRAINT "organization_agreements_organizationId_fkey";

-- DropTable
DROP TABLE "organization_addresses";

-- DropTable
DROP TABLE "organization_agreements";

-- DropTable
DROP TABLE "organizations";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxId" TEXT,
    "foundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationAddress" (
    "id" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationAgreements" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '',
    "termsAndServicesAgreement" BOOLEAN NOT NULL,
    "representativePersonAgreement" BOOLEAN NOT NULL,
    "electronicAgreement" BOOLEAN NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationAgreements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_taxId_key" ON "Organization"("taxId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationAddress_organizationId_key" ON "OrganizationAddress"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationAgreements_organizationId_key" ON "OrganizationAgreements"("organizationId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationAddress" ADD CONSTRAINT "OrganizationAddress_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationAgreements" ADD CONSTRAINT "OrganizationAgreements_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
