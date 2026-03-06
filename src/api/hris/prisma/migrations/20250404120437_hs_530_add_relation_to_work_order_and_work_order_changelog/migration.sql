-- AlterEnum
ALTER TYPE "WorkOrderChangeType" ADD VALUE 'ASSIGNEES_UPDATED';

-- AddForeignKey
ALTER TABLE "WorkOrderChangelog" ADD CONSTRAINT "WorkOrderChangelog_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
