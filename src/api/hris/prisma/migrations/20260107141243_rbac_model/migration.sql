/*
  Warnings:

  - The primary key for the `IdentityRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `IdentityRole` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `IdentityRole` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('EMPLOYEES', 'COMPANY_ABSENCES', 'COMPANY_DOCUMENTS', 'COMPANY_EQUIPMENT', 'COMPANY_BENEFITS', 'COMPANY_SETTINGS', 'EMPLOYEE_PROFILE', 'EMPLOYEE_DOCUMENTS', 'EMPLOYEE_EQUIPMENT', 'EMPLOYEE_ABSENCES', 'EMPLOYEE_FEEDBACK', 'EMPLOYEE_EARNINGS');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('VIEW', 'CREATE', 'EDIT', 'DELETE', 'ASSIGN', 'EXPORT');

-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('ALL', 'SELF');

-- DropForeignKey
ALTER TABLE "IdentityRole" DROP CONSTRAINT "IdentityRole_identityId_fkey";

-- AlterTable
ALTER TABLE "IdentityRole" DROP CONSTRAINT "IdentityRole_pkey",
DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD CONSTRAINT "IdentityRole_pkey" PRIMARY KEY ("identityId", "roleId");

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "resource" "ResourceType" NOT NULL,
    "actions" "PermissionAction"[],
    "scope" "PermissionScope" NOT NULL DEFAULT 'ALL',
    "fieldAccess" JSONB,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");

-- CreateIndex
CREATE INDEX "Role_key_idx" ON "Role"("key");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_resource_key" ON "RolePermission"("roleId", "resource");

-- CreateIndex
CREATE INDEX "IdentityRole_identityId_idx" ON "IdentityRole"("identityId");

-- CreateIndex
CREATE INDEX "IdentityRole_roleId_idx" ON "IdentityRole"("roleId");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityRole" ADD CONSTRAINT "IdentityRole_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityRole" ADD CONSTRAINT "IdentityRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
