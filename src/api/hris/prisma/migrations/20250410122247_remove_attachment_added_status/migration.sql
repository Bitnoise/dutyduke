/*
  Warnings:

  - The values [ATTACHMENT_ADDED] on the enum `WorkOrderChangeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkOrderChangeType_new" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'COMMENT_ADDED', 'ASSIGNEES_UPDATED');
ALTER TABLE "WorkOrderChangelog" ALTER COLUMN "type" TYPE "WorkOrderChangeType_new" USING ("type"::text::"WorkOrderChangeType_new");
ALTER TYPE "WorkOrderChangeType" RENAME TO "WorkOrderChangeType_old";
ALTER TYPE "WorkOrderChangeType_new" RENAME TO "WorkOrderChangeType";
DROP TYPE "WorkOrderChangeType_old";
COMMIT;
